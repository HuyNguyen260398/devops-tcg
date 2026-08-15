data "aws_route53_zone" "public" {
  name         = "${trimsuffix(var.zone_name, ".")}."
  private_zone = false
}

resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    ManagedBy = "Terraform"
    Name      = var.domain_name
    Project   = "DevOps TCG"
  }
}

resource "aws_route53_record" "validation" {
  for_each = toset([var.domain_name])

  zone_id = data.aws_route53_zone.public.zone_id
  name = one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_name
    if option.domain_name == each.key
  ])
  type = one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_type
    if option.domain_name == each.key
  ])
  ttl = 60
  records = [one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_value
    if option.domain_name == each.key
  ])]
}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}
