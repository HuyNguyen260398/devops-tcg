terraform {
  backend "s3" {
    key     = "prod/terraform.tfstate"
    encrypt = true
  }
}
