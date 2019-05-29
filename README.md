# Landorade - static website that makes sense

Landorade is a tool to cover whole static website life cycle from development to production.
It includes convenient tools for developing, managing and deploying SPA to AWS.

## Prerequisites

- [ ] Git
- [ ] NodeJS >= v8.x.x
- [ ] Terraform >= v0.12.x
- [ ] AWS CLI (**configured! w/ credentials**)

## Installation

- Clone repository `git clone --recursive git@gitlab.titanium.codes:tools/landorade.git`
- Access created folder `cd landorade`
- Install `landorade` globally `npm install -g .`

## Deploying a website

Follow the instructions below to deploy a static website:

*(assuming that the domain is `example.com` and the project is located in `your/project/path` directory)*

- [ ] Initialize `landorade init your/project/path` (This command will create a `landorade.json` configuration file)
- [ ] Edit `landorade.json` to match your project details (e.g. domain, secret or website content folder)
- [ ] Provision AWS infrastructure for the website `landorade provision your/project/path`
    - [ ] When `Provisioning infrastructureaws_acm_certificate_validation.cert: Still creating...` message appears on your screen- open [Route53 Hosted Zones](https://console.aws.amazon.com/route53/home#hosted-zones:) and [setup your domain to use Route53 DNS](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring.html)\*
- [ ] Deploy your website `landorade deploy your/project/path`

> \* Without using Route53 as for managing DNS `landorade` won't be able to validate certificate, thus provisioning whole infrastructure. You'll have up to **2 hours** to validate certificate.

-----

The website will be accessible from `https://example.com` redirecting from `www.*` alias and `http://*` protocol.
Also an IAM user named `example.com-deploy` is created that is given deployment access to the S3 bucket containing the site data.

*Every time you want to update website run `landorade deploy your/project/path`.*

## Undeploying a website

Simply run `landorade destroy your/project/path` to undeploy the website and destroy provisioned AWS infrastructure.
