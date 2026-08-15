# DevOps TCG Infrastructure

Terraform provisions a one-time remote-state backend and a separate production
static-site stack. The production stack reads the existing public
`nghuy.link.` Route 53 zone; it does not own the zone.

## Layout

```text
infra/
├── bootstrap/          # Versioned S3 state bucket and DynamoDB lock table
├── envs/prod/          # Providers, modules, DNS aliases, and outputs
└── modules/
    ├── domain/         # Existing-zone lookup, us-east-1 ACM, DNS validation
    └── frontend/       # Private S3, CloudFront OAC, caching, security headers
```

## Prerequisites

- Terraform 1.7 or newer
- AWS CLI credentials with permission to manage the documented resources
- A public Route 53 hosted zone named `nghuy.link.` in the deployment account
- Globally unique state and site bucket names

## Bootstrap Remote State

Create the backend once. Replace the example account suffix with the deployment
AWS account ID:

```bash
terraform -chdir=infra/bootstrap init
terraform -chdir=infra/bootstrap apply \
  -var="region=ap-southeast-1" \
  -var="state_bucket_name=devops-tcg-tfstate-123456789012"
```

Read the backend values:

```bash
terraform -chdir=infra/bootstrap output -raw state_bucket_name
terraform -chdir=infra/bootstrap output -raw lock_table_name
```

The bootstrap bucket is private, AES256 encrypted, and versioned. The lock table
uses on-demand billing and the `LockID` partition key.

## Initialize and Plan Production

```bash
terraform -chdir=infra/envs/prod init -reconfigure \
  -backend-config="bucket=devops-tcg-tfstate-123456789012" \
  -backend-config="region=ap-southeast-1" \
  -backend-config="dynamodb_table=devops-tcg-tf-locks"

terraform -chdir=infra/envs/prod plan \
  -var="region=ap-southeast-1" \
  -var="site_bucket_name=devops-tcg-prod-site-123456789012" \
  -var="route53_zone_name=nghuy.link" \
  -var="site_domain=tcg.nghuy.link"
```

Review the plan before applying it. ACM certificates for CloudFront are always
created in `us-east-1`; the private site bucket is created in the supplied
`AWS_REGION`.

## Outputs

The production root exports:

- `site_bucket_name`
- `distribution_id`
- `distribution_domain`
- `certificate_arn`
- `site_url`

GitHub Actions consumes the bucket, distribution ID, and site URL during
deployment.

## Local Quality Checks

```bash
terraform fmt -check -recursive infra
terraform -chdir=infra/bootstrap init -backend=false
terraform -chdir=infra/bootstrap validate
terraform -chdir=infra/bootstrap test
terraform -chdir=infra/modules/frontend init -backend=false
terraform -chdir=infra/modules/frontend test
terraform -chdir=infra/modules/domain init -backend=false
terraform -chdir=infra/modules/domain test
terraform -chdir=infra/envs/prod init -backend=false
terraform -chdir=infra/envs/prod validate
tflint --chdir=infra --recursive
uvx checkov -d infra --quiet
```

Checkov exceptions are scoped to individual resources and explain where an
enterprise control conflicts with the approved single-origin, single-region,
read-only architecture.

## GitHub Configuration

The workflows require secrets `AWS_PLAN_ROLE_ARN` and `AWS_DEPLOY_ROLE_ARN`,
plus variables `AWS_REGION`, `STATE_BUCKET_NAME`, `LOCK_TABLE_NAME`,
`SITE_BUCKET_NAME`, `ROUTE53_ZONE_NAME`, and `SITE_DOMAIN`.

Use a read-only plan role and a least-privilege deploy role. Do not configure
long-lived AWS access keys.

## Safe Teardown

> [!CAUTION]
> S3 buckets are versioned and intentionally do not use `force_destroy`.
> Resolve and confirm each exact bucket name before deleting objects or
> versions.

1. Empty every current object and every version from the production site
   bucket.
2. Run `terraform -chdir=infra/envs/prod destroy` with the same production
   variables used for apply.
3. Confirm no Terraform state still uses the backend.
4. Empty every object version from the state bucket.
5. Run `terraform -chdir=infra/bootstrap destroy` with the original bootstrap
   variables.

Production destroy removes the `tcg.nghuy.link` A/AAAA and ACM validation
records, the certificate, CloudFront distribution, and site bucket. It never
destroys the parent `nghuy.link` hosted zone.
