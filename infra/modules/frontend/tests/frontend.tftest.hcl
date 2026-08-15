mock_provider "aws" {}

run "private_https_site" {
  command = plan

  variables {
    name_prefix     = "devops-tcg-test"
    bucket_name     = "devops-tcg-test-site"
    aliases         = ["tcg.nghuy.link"]
    certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/00000000-0000-0000-0000-000000000000"
  }

  assert {
    condition     = aws_s3_bucket_public_access_block.site.restrict_public_buckets
    error_message = "The site bucket must reject public access."
  }

  assert {
    condition     = aws_cloudfront_distribution.site.default_cache_behavior[0].viewer_protocol_policy == "redirect-to-https"
    error_message = "CloudFront must redirect HTTP to HTTPS."
  }

  assert {
    condition     = toset(aws_cloudfront_distribution.site.aliases) == toset(["tcg.nghuy.link"])
    error_message = "CloudFront must serve the requested alias."
  }
}
