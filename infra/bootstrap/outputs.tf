output "state_bucket_name" {
  description = "Name of the S3 bucket that stores Terraform state."
  value       = aws_s3_bucket.state.id
}

output "lock_table_name" {
  description = "Name of the DynamoDB state-lock table."
  value       = aws_dynamodb_table.locks.name
}
