# [WIP] Landorade - static website that makes sense

Landorade is a tool to cover whole static website life cycle from development to production.
It includes convenient tools for developing, managing and deploying SPA to AWS.

## Prerequisites

- [ ] Git
- [ ] NodeJS >= v8.x.x
- [ ] [Terraform](https://www.terraform.io) >= v0.12.x
- [ ] AWS CLI (**configured! w/ credentials**)

> CMS module is based on [Vapid](https://www.vapid.com) which is installed automatically. It is not mandatory to be used but provides good UI and development and client experience.

## Installation

- Clone repository `git clone --recursive git@{repository}/landorade.git`
- Access created folder `cd landorade`
- Install `landorade` globally `npm install -g .`

## Generating the website

*(since Vapid official version is not supporting statical website builds, we use a fork- [https://github.com/AlexanderC/vapid](https://github.com/AlexanderC/vapid))*

Best way to develop and manage your website is using [Vapid](https://www.vapid.com) CMS module.

> In case you DO NOT need the CMS module and just want to deploy a developed SPA- jump to `Provisioning infrastructure for the website` section below.

### Initializing the CMS module

To initialize CMS module and generate basic structure run: `landorade cms init your/project/path`

### Starting CMS development server

To start CMS development server run: `landorade cms start your/project/path`

**In order to get guidlines on development visit [Official Docummentation](https://docs.vapid.com) webpage.**

> You can access the website on [http://localhost:3000](http://localhost:3000) and the managing dashboard on [http://localhost:3000/dashboard/](http://localhost:3000/dashboard/)

### **[WIP]** Build static files using CMS module

To build static files run: `landorade cms build your/project/path`

## Provisioning infrastructure for the website

Follow the instructions below to deploy a static website:

*(assuming that the domain is `example.com` and the project is located in `your/project/path` directory)*

- [ ] Initialize `landorade init your/project/path` (This command will create a `landorade.json` configuration file)
- [ ] Edit `landorade.json` to match your project details (e.g. domain, secret or website content folder)
- [ ] Provision AWS infrastructure for the website `landorade provision your/project/path`
    - [ ] When `Provisioning infrastructureaws_acm_certificate_validation.cert: Still creating...` message appears on your screen- open [Route53 Hosted Zones](https://console.aws.amazon.com/route53/home#hosted-zones:) and [setup your domain to use Route53 DNS](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring.html)\*

> \* Without using Route53 as for managing DNS `landorade` won't be able to validate certificate, thus provisioning whole infrastructure. You'll have up to **2 hours** to validate certificate.

## Deploying the website

*...before deploying, if you are using CMS module run `landorade cms build your/project/path` to build the static files first...*

To deploy\* the website run `landorade deploy your/project/path`.

> \* By default the website is deployed from `dist/` folder in the project root (`your/project/path`).

-------------

The website will be accessible from `https://example.com` redirecting from `www.*` alias and `http://*` protocol.
Also an IAM user named `example.com-deploy` is created that is given deployment access to the S3 bucket containing the site data.

*Every time you want to update website run `landorade deploy your/project/path`.*

## Undeploying the website

Simply run `landorade destroy your/project/path` to undeploy the website and destroy provisioned AWS infrastructure.
