# Image attribution

Every thumbnail in the deck is either project-generated or project-drawn. No
third-party artwork remains.

## Project-generated illustrations

The following illustrations were generated specifically for DevOps TCG with
OpenAI image generation on 2026-08-15 and are stored locally:

- `cdn-thumbnail.webp`
- `nginx-thumbnail.webp`
- `reverse-proxy-thumbnail.webp`
- `osi-model-thumbnail.webp`
- `dns-thumbnail.webp`
- `ssl-thumbnail.webp`
- `tls-thumbnail.webp`
- `ssh-thumbnail.webp`

## Project-drawn illustrations

`lambda-throttle-thumbnail.webp` was drawn for DevOps TCG on 2026-08-19,
`public-ca-thumbnail.webp` and `private-ca-thumbnail.webp` on 2026-08-20,
`jwt-thumbnail.webp` on 2026-08-21, `oidc-thumbnail.webp` on 2026-08-25,
`kafka-thumbnail.webp` on 2026-08-26, `redis-thumbnail.webp` on 2026-08-27,
`rbac-thumbnail.webp` on 2026-08-28, `redis-cluster-thumbnail.webp` on
2026-08-29, `container-thumbnail.webp` on 2026-08-30,
`terraform-state-thumbnail.webp` on 2026-08-31,
`kubernetes-pod-thumbnail.webp` on 2026-09-01, `prometheus-thumbnail.webp` with
`prometheus-federation-thumbnail.webp` on 2026-09-02,
`aws-alb-thumbnail.webp` with `aws-nlb-thumbnail.webp` on 2026-09-03,
`proxy-thumbnail.webp` on 2026-09-05, `aws-vpc-thumbnail.webp` on
2026-09-06, and `aws-subnet-thumbnail.webp` on 2026-09-07, each as
an isometric SVG scene composed in-repo and rendered to WebP with headless
Chromium. They contain no
third-party artwork.

`proxy-thumbnail.webp` replaced an Unsplash photograph, which was the one
thumbnail in the deck that was neither drawn for it nor 16:9.

## Sketch-theme drawings

The thirty `*-sketch.svg` files are original hand-authored SVG line
drawings made for DevOps TCG on 2026-08-19, on 2026-08-20 for the two
certificate authority cards, on 2026-08-21 for JWT, on 2026-08-23 for AWS
Lambda, on 2026-08-24 for the two IAM cards, on 2026-08-25 for OIDC, on
2026-08-26 for Kafka, on 2026-08-27 for Redis, on 2026-08-28 for RBAC, on
2026-08-29 for Redis Cluster, on 2026-08-30 for Container, on 2026-08-31 for
Terraform State, on 2026-09-01 for Kubernetes Pod, on 2026-09-02 for Prometheus
and Prometheus Federation, on 2026-09-03 for AWS ALB and AWS NLB, on
2026-09-06 for AWS VPC, and on 2026-09-07 for AWS Subnet. Their line work is
plain `<path>` geometry — no tracing of any third-party image, no generator,
and no external asset — and they are the artwork the sketch theme shows in
place of the photographs above.
Ink is `#1d1d1b`, the highlighter block is `#fff2c4`, and the subject block is
`#dbe7ff`, matching the sketch theme's tokens. `aws-lambda-sketch.svg`,
`aws-iam-role-sketch.svg`, `aws-iam-policy-sketch.svg`, `aws-alb-sketch.svg`,
`aws-nlb-sketch.svg`, `aws-vpc-sketch.svg` and `aws-subnet-sketch.svg` are the
exceptions to the own-geometry rule: each
drawing is hand-authored, but the AWS marks inside it are official AWS icons
described below.

## AWS Architecture Icons

`aws-lambda-thumbnail.webp` and `aws-lambda-sketch.svg` embed the official AWS
Lambda service icon, `Arch_AWS-Lambda_48`, taken from the AWS Architecture
Icons asset package (Release 23-2026.04.28). It appears exactly as AWS ships
it — the `#ED7100` Compute tile and the white lambda mark, uniformly scaled,
neither recoloured nor otherwise modified — and it stays that way on both
themes, since the terms below do not permit altering the icons. Everything
around it in those two files was drawn for DevOps TCG on 2026-08-23.

The four IAM files embed two resource icons from the same asset package, out of
its `Resource-Icons_04302026` set:

- `aws-iam-role-thumbnail.webp` and `aws-iam-role-sketch.svg` carry
  `Res_AWS-Identity-Access-Management_Role_48`.
- `aws-iam-policy-thumbnail.webp` and `aws-iam-policy-sketch.svg` carry
  `Res_AWS-Identity-Access-Management_Permissions_48`.

Both are the `#DD344C` line-art marks AWS publishes for light backgrounds, and
both appear uniformly scaled, neither recoloured nor otherwise modified. That
is why the neon theme seats each one on a light plate instead of inverting it:
the terms do not permit a dark-theme variant of an icon AWS does not ship one
for. Everything around them in those four files was drawn for DevOps TCG on
2026-08-24.

The four load balancer files embed two more resource icons from that same
`Resource-Icons_04302026` set:

- `aws-alb-thumbnail.webp` and `aws-alb-sketch.svg` carry
  `Res_Elastic-Load-Balancing_Application-Load-Balancer_48`.
- `aws-nlb-thumbnail.webp` and `aws-nlb-sketch.svg` carry
  `Res_Elastic-Load-Balancing_Network-Load-Balancer_48`.

Both are the `#8C4FFF` line-art marks AWS publishes for light backgrounds, and
both appear uniformly scaled, neither recoloured nor otherwise modified — which
is why the neon theme seats each one on a light plate rather than inverting it,
exactly as the IAM icons above are handled. Everything around them in those
four files was drawn for DevOps TCG on 2026-09-03.

`aws-vpc-thumbnail.webp` and `aws-vpc-sketch.svg` carry
`Res_Amazon-VPC_Virtual-private-cloud-VPC_48`. It is the same `#8C4FFF`
line-art mark for light backgrounds, handled the same way — uniformly scaled,
neither recoloured nor otherwise modified, and seated on a light plate in the
neon theme. It comes from a later download of the package than the icons above,
out of its `Resource-Icons_07312026` set, because that is the release AWS was
publishing on the day the card was drawn. Everything around it in those two
files was drawn for DevOps TCG on 2026-09-06.

`aws-subnet-thumbnail.webp` and `aws-subnet-sketch.svg` are the one pair
carrying two marks, because the card's subject is the chain between them:
`Res_Amazon-VPC_NAT-Gateway_48` and `Res_Amazon-VPC_Internet-Gateway_48`, both
from the `Resource-Icons_04302026` set. They are the same `#8C4FFF` line-art
marks for light backgrounds, handled exactly as the icons above are —
uniformly scaled, neither recoloured nor otherwise modified, and each seated on
its own light plate in the neon theme rather than inverted. Everything around
them in those two files was drawn for DevOps TCG on 2026-09-07.

`aws-cidr-sketch.svg` carries `Res_Amazon-VPC_Virtual-private-cloud-VPC_48`,
the same mark the AWS VPC pair above uses and out of the same
`Resource-Icons_07312026` set, because the card argues about the ranges those
VPCs are cut from. It is embedded exactly as shipped — `#8C4FFF` line art for
light backgrounds, uniformly scaled, neither recoloured nor otherwise modified,
and seated on a light plate in the neon theme rather than inverted. Everything
around it in that file, and the whole of `aws-cidr-thumbnail.webp`, was drawn
for DevOps TCG on 2026-09-08.

`aws-route-table-thumbnail.webp` and `aws-route-table-sketch.svg` carry
`Res_Amazon-VPC_Internet-Gateway_48`, the same mark the AWS Subnet pair above
uses and out of the same `Resource-Icons_04302026` set, because the card ends
on a table associated with a gateway rather than with a subnet. It is the same
`#8C4FFF` line-art mark for light backgrounds, embedded exactly as shipped —
uniformly scaled, neither recoloured nor otherwise modified, and seated on a
light plate in the neon theme rather than inverted. The rows, the packet and
the tables around it were drawn for DevOps TCG on 2026-09-08. There is no
official Route Table mark in this repository, so none is claimed here.

- Source: https://aws.amazon.com/architecture/icons/
- Terms: https://aws.amazon.com/architecture/icons/ ("AWS Architecture Icons
  Terms of Use", linked from that page)

AWS, AWS Lambda, AWS Identity and Access Management, Elastic Load Balancing
and Amazon VPC are trademarks of Amazon.com, Inc. or its affiliates. This deck is an
independent study project and is not affiliated with, endorsed by, or sponsored
by AWS.
