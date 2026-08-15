variable "name_prefix" {
  description = "Prefix used to name frontend delivery resources."
  type        = string

  validation {
    condition     = length(trimspace(var.name_prefix)) > 0
    error_message = "name_prefix must not be empty."
  }
}

variable "bucket_name" {
  description = "Globally unique name for the private static-site bucket."
  type        = string

  validation {
    condition     = length(trimspace(var.bucket_name)) > 0
    error_message = "bucket_name must not be empty."
  }
}

variable "aliases" {
  description = "Custom domain aliases served by CloudFront."
  type        = list(string)

  validation {
    condition     = length(var.aliases) > 0 && alltrue([for alias in var.aliases : length(trimspace(alias)) > 0])
    error_message = "aliases must contain at least one non-empty domain name."
  }
}

variable "certificate_arn" {
  description = "ARN of the us-east-1 ACM certificate for the CloudFront aliases."
  type        = string

  validation {
    condition     = can(regex("^arn:[^:]+:acm:us-east-1:[0-9]{12}:certificate/.+$", var.certificate_arn))
    error_message = "certificate_arn must be a us-east-1 ACM certificate ARN."
  }
}
