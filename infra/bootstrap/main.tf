locals {
  common_tags = {
    ManagedBy = "Terraform"
    Project   = "DevOps TCG"
  }
}

resource "aws_s3_bucket" "state" {
  # checkov:skip=CKV_AWS_18:A dedicated access-log bucket would create a second bootstrap storage dependency.
  # checkov:skip=CKV_AWS_144:Cross-region replication is outside the approved one-region backend design.
  # checkov:skip=CKV_AWS_145:The approved bootstrap explicitly uses S3-managed AES256 encryption.
  # checkov:skip=CKV2_AWS_61:Terraform state versions must not expire automatically.
  # checkov:skip=CKV2_AWS_62:The state bucket has no event-driven consumer.
  bucket = var.state_bucket_name

  tags = merge(local.common_tags, {
    Name = var.state_bucket_name
  })
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_dynamodb_table" "locks" {
  # checkov:skip=CKV_AWS_28:Point-in-time recovery is unnecessary for transient Terraform lock records.
  # checkov:skip=CKV_AWS_119:A customer-managed KMS key is outside this minimal state-lock bootstrap.
  name         = var.lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = merge(local.common_tags, {
    Name = var.lock_table_name
  })
}
