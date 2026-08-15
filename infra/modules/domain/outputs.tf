output "certificate_arn" {
  description = "ARN of the validated us-east-1 ACM certificate."
  value       = aws_acm_certificate_validation.site.certificate_arn
}

output "zone_id" {
  description = "ID of the existing public Route 53 hosted zone."
  value       = data.aws_route53_zone.public.zone_id
}
