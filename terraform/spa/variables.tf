variable "DOMAIN" {
  type        = "string"
  description = "A domain name for which the certificate should be issued"
}

variable "SECRET" {
  type        = "string"
  description = "Duplicate content penalty secret"
}
