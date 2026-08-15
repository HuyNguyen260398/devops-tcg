module "domain" {
  source = "../../modules/domain"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  zone_name   = var.route53_zone_name
  domain_name = var.site_domain
}

module "frontend" {
  source = "../../modules/frontend"

  name_prefix     = var.name_prefix
  bucket_name     = var.site_bucket_name
  aliases         = [var.site_domain]
  certificate_arn = module.domain.certificate_arn
}

resource "aws_route53_record" "site_a" {
  zone_id = module.domain.zone_id
  name    = var.site_domain
  type    = "A"

  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_aaaa" {
  zone_id = module.domain.zone_id
  name    = var.site_domain
  type    = "AAAA"

  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
