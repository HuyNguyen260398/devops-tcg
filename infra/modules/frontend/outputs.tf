output "bucket_name" {
  description = "Name of the private static-site bucket."
  value       = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain" {
  description = "CloudFront distribution domain name."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "distribution_hosted_zone_id" {
  description = "Hosted zone ID used for Route 53 aliases to CloudFront."
  value       = aws_cloudfront_distribution.site.hosted_zone_id
}
