output "site_bucket_name" {
  description = "Name of the private production site bucket."
  value       = module.frontend.bucket_name
}

output "distribution_id" {
  description = "ID of the production CloudFront distribution."
  value       = module.frontend.distribution_id
}

output "distribution_domain" {
  description = "CloudFront distribution domain name."
  value       = module.frontend.distribution_domain
}

output "certificate_arn" {
  description = "ARN of the validated production ACM certificate."
  value       = module.domain.certificate_arn
}

output "site_url" {
  description = "Canonical HTTPS URL of the production site."
  value       = "https://${var.site_domain}"
}
