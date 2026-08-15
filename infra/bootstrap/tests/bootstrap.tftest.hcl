mock_provider "aws" {}

run "secure_remote_state" {
  command = plan

  variables {
    region            = "us-east-1"
    state_bucket_name = "devops-tcg-test-state"
    lock_table_name   = "devops-tcg-test-locks"
  }

  assert {
    condition     = aws_s3_bucket_public_access_block.state.block_public_policy
    error_message = "The state bucket must block public policies."
  }

  assert {
    condition     = aws_s3_bucket_versioning.state.versioning_configuration[0].status == "Enabled"
    error_message = "The state bucket must enable versioning."
  }

  assert {
    condition     = aws_dynamodb_table.locks.billing_mode == "PAY_PER_REQUEST"
    error_message = "The lock table must use on-demand billing."
  }
}
