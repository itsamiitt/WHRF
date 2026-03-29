# WHRF AWS Deployment Guide

This repository is a static website built with plain HTML, CSS, JavaScript, images, and optional JSON content.

That means the cleanest AWS setup is:

1. Amazon S3 to store the site files
2. Amazon CloudFront to serve the site over HTTPS
3. AWS Certificate Manager for the SSL certificate
4. Route 53 or your DNS provider to point your domain to CloudFront

## Important Before You Publish

- The main site is static and safe to host on S3 + CloudFront.
- The `dashboard/` folder is not a real backend admin panel.
- `dashboard/` uses browser `localStorage` and frontend-only password logic.
- Do not publish `dashboard/` publicly unless you understand it is only a client-side demo/tool, not secure authentication.
- The deploy script below excludes `dashboard/` by default.

## Recommended Production Setup

Use this structure for production:

1. Create an S3 bucket for the site files
2. Keep the bucket private
3. Create a CloudFront distribution with the S3 bucket as origin
4. Use Origin Access Control (OAC) so CloudFront can read the bucket
5. Set the CloudFront default root object to `index.html`
6. Add your custom domain to CloudFront
7. Request an ACM certificate in `us-east-1`
8. Point DNS to the CloudFront distribution

If you want the site to support clean URLs like `/about` instead of `/about.html`, use the optional CloudFront Function in [aws/cloudfront-url-rewrite.js](/c:/Users/Administrator/Downloads/WHRF/aws/cloudfront-url-rewrite.js).

## Quick Start

### 1. Install and configure AWS CLI

If AWS CLI is not installed yet, install it first, then run:

```powershell
aws configure
```

You will be asked for:

- AWS Access Key ID
- AWS Secret Access Key
- Default region
- Output format

### 2. Create an S3 bucket

Example bucket names:

- `yourdomain.com`
- `www.yourdomain.com`
- `wrhwfour.com`

You can create the bucket from the AWS Console or CLI.

### 3. Upload the site

From the repo root:

```powershell
.\scripts\deploy-to-s3.ps1 -BucketName your-bucket-name -Region ap-south-1
```

If you also want to upload the dashboard:

```powershell
.\scripts\deploy-to-s3.ps1 -BucketName your-bucket-name -Region ap-south-1 -IncludeDashboard
```

Preview the upload without changing anything:

```powershell
.\scripts\deploy-to-s3.ps1 -BucketName your-bucket-name -Region ap-south-1 -DryRun
```

Upload and remove old files from the bucket that no longer exist locally:

```powershell
.\scripts\deploy-to-s3.ps1 -BucketName your-bucket-name -Region ap-south-1 -DeleteRemoved
```

## CloudFront Setup

Create a CloudFront distribution with:

- Origin: your S3 bucket
- Origin access: `Origin Access Control`
- Viewer protocol policy: `Redirect HTTP to HTTPS`
- Default root object: `index.html`
- Alternate domain names: your real domain, for example `wrhwfour.com`
- SSL certificate: the ACM certificate created in `us-east-1`

### Optional Clean URL Support

This repo uses files like:

- `about.html`
- `contact.html`
- `services.html`
- `services/server-installation.html`

Some canonical URLs in the HTML already point to clean paths like `/about` and `/services`.

If you want those clean URLs to work in CloudFront without renaming files, attach the function in [aws/cloudfront-url-rewrite.js](/c:/Users/Administrator/Downloads/WHRF/aws/cloudfront-url-rewrite.js) to the `Viewer Request` event.

It rewrites requests like:

- `/` -> `/index.html`
- `/about` -> `/about.html`
- `/services/server-installation` -> `/services/server-installation.html`
- `/dashboard` -> `/dashboard/index.html`

## DNS Setup

If your domain is in Route 53:

1. Open the hosted zone
2. Create an `A` record
3. Choose `Alias`
4. Point it to the CloudFront distribution

If you use another DNS provider:

1. Create a `CNAME` for `www`
2. Point it to the CloudFront domain name
3. For apex/root domain support, use your provider's ALIAS/ANAME feature if supported

## Pre-Launch Checklist

Before going live, review these files and replace placeholders:

- [index.html](/c:/Users/Administrator/Downloads/WHRF/index.html)
- [about.html](/c:/Users/Administrator/Downloads/WHRF/about.html)
- [contact.html](/c:/Users/Administrator/Downloads/WHRF/contact.html)
- [services.html](/c:/Users/Administrator/Downloads/WHRF/services.html)
- [data/site-config.json](/c:/Users/Administrator/Downloads/WHRF/data/site-config.json)

Things to verify:

- Real phone number instead of `+91-XXXXXXXXXX`
- Real WhatsApp number instead of `91XXXXXXXXXX`
- Real social links instead of `#`
- Real map embed if needed
- Real analytics ID if you enable Google Analytics
- Whether `assets/images/og-image.png` exists before sharing links publicly

## Suggested First Deploy Flow

1. Create the S3 bucket
2. Run the deploy script without `-IncludeDashboard`
3. Create the CloudFront distribution
4. Add SSL certificate in `us-east-1`
5. Point DNS to CloudFront
6. Test:
   - `/`
   - `/about.html`
   - `/services.html`
   - one page inside `/services/`
7. If you want clean URLs, attach the CloudFront Function and test `/about`

## Notes About The Dashboard

The dashboard currently behaves like a local demo application:

- Login password logic is stored in frontend code
- Data is stored in the visitor's own browser
- Changes do not update the public HTML files on the server
- CMS export saves JSON locally instead of publishing to AWS

If you want a real secure admin panel later, we should add a backend and authentication before exposing it publicly.
