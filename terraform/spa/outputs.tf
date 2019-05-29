output "deployerAccessKeyId" {
  description = "The AWS Access Key ID for the IAM deployment user."
  value = "${aws_iam_access_key.deploy.id}"
}

output "deployerSecretKey" {
  description = "The AWS Secret Key for the IAM deployment user."
  value = "${aws_iam_access_key.deploy.secret}"
}

output "deployBucket" {
  description = "The AWS S3 bucket ID used for deployment"
  value = "${aws_s3_bucket.main.id}"
}

output "cfDistribution" {
  description = "The AWS CloudFront distribution used as CDN for the website"
  value = "${aws_cloudfront_distribution.cdn.0.id}"
}
