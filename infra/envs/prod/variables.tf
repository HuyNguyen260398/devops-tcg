variable "region" {
  description = "AWS region for the site bucket and regional resources."
  type        = string

  validation {
    condition     = length(trimspace(var.region)) > 0
    error_message = "region must not be empty."
  }
}

variable "name_prefix" {
  description = "Prefix used to name production resources."
  type        = string
  default     = "devops-tcg-prod"
}

variable "site_bucket_name" {
  description = "Globally unique name for the private production site bucket."
  type        = string

  validation {
    condition     = length(trimspace(var.site_bucket_name)) > 0
    error_message = "site_bucket_name must not be empty."
  }
}

variable "route53_zone_name" {
  description = "Name of the existing public Route 53 hosted zone."
  type        = string
  default     = "nghuy.link"
}

variable "site_domain" {
  description = "Exact production custom domain."
  type        = string
  default     = "tcg.nghuy.link"
}
