mock_provider "aws" {}
mock_provider "aws" {
  alias = "us_east_1"

  mock_resource "aws_acm_certificate" {
    defaults = {
      arn = "arn:aws:acm:us-east-1:123456789012:certificate/00000000-0000-0000-0000-000000000000"
      domain_validation_options = [
        {
          domain_name           = "tcg.nghuy.link"
          resource_record_name  = "_test.tcg.nghuy.link."
          resource_record_type  = "CNAME"
          resource_record_value = "_test.acm-validations.aws."
        },
      ]
    }
  }
}

override_data {
  target = data.aws_route53_zone.public
  values = { zone_id = "Z0123456789TEST" }
}

run "existing_zone_and_certificate" {
  command = plan

  variables {
    zone_name   = "nghuy.link"
    domain_name = "tcg.nghuy.link"
  }

  assert {
    condition     = data.aws_route53_zone.public.private_zone == false
    error_message = "The module must select the public hosted zone."
  }

  assert {
    condition     = aws_acm_certificate.site.domain_name == "tcg.nghuy.link"
    error_message = "The certificate must cover the exact site domain."
  }
}
