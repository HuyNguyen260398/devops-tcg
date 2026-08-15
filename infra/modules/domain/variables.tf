variable "zone_name" {
  description = "Name of the existing public Route 53 hosted zone."
  type        = string

  validation {
    condition     = length(trimspace(trimsuffix(var.zone_name, "."))) > 0
    error_message = "zone_name must not be empty."
  }
}

variable "domain_name" {
  description = "Exact custom domain to validate and serve."
  type        = string

  validation {
    condition     = length(trimspace(var.domain_name)) > 0
    error_message = "domain_name must not be empty."
  }
}
