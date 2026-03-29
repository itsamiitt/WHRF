# EC2 Publish Guide for `wrhw.thecloso.com`

This repo can be published on EC2 with Nginx because the checked-in code is frontend/static.
`index.html` is the main landing page at `/`, and the rest of the pages are deployed alongside it.

Important note:

- The public contact form currently does not send data to any backend.
- It only validates in the browser and logs the payload to the browser console.
- You can confirm that in `assets/script.js`.
- The dashboard is also frontend-only and uses browser storage, so it is not a secure admin backend.

If you have a separate backend on the same EC2 instance, you can proxy it through Nginx later.

## 1. Point DNS to the EC2 instance

Create an `A` record:

- Host: `wrhw`
- Value: your EC2 public IP or Elastic IP

If you use Cloudflare, keep the record as DNS-only until SSL is issued successfully.

## 2. SSH into the server

```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Amazon Linux usually uses:

```bash
ssh -i /path/to/your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

## 3. Install packages

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx rsync
sudo systemctl enable --now nginx
```

### Amazon Linux 2023

```bash
sudo dnf update -y
sudo dnf install -y nginx rsync python3-pip
sudo python3 -m pip install certbot certbot-nginx
sudo systemctl enable --now nginx
```

## 4. Clone the repo on the server

```bash
cd ~
git clone <YOUR_REPO_URL> WHRF
cd WHRF
```

If the repo is already cloned:

```bash
cd ~/WHRF
git pull
```

## 5. Copy the site into the Nginx web root

This script publishes the full site so the landing page, inner pages, and service pages all stay linked.

```bash
cd ~/WHRF
chmod +x scripts/deploy-to-ec2.sh
sudo DOMAIN=wrhw.thecloso.com bash scripts/deploy-to-ec2.sh
```

## 6. Install the Nginx site config

### Ubuntu / Debian

```bash
sudo cp deploy/nginx/wrhw.thecloso.com.conf /etc/nginx/sites-available/wrhw.thecloso.com.conf
sudo ln -sfn /etc/nginx/sites-available/wrhw.thecloso.com.conf /etc/nginx/sites-enabled/wrhw.thecloso.com.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Amazon Linux 2023

```bash
sudo cp deploy/nginx/wrhw.thecloso.com.conf /etc/nginx/conf.d/wrhw.thecloso.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Issue SSL for `wrhw.thecloso.com`

### Ubuntu / Debian

```bash
sudo certbot --nginx -d wrhw.thecloso.com
```

### Amazon Linux 2023

```bash
sudo certbot --nginx -d wrhw.thecloso.com
```

## 8. Test the site

```bash
curl -I http://wrhw.thecloso.com
curl -I https://wrhw.thecloso.com
curl -I https://wrhw.thecloso.com/about
curl -I https://wrhw.thecloso.com/services
curl -I https://wrhw.thecloso.com/services/server-installation
```

Open these in the browser too:

- `https://wrhw.thecloso.com/`
- `https://wrhw.thecloso.com/about`
- `https://wrhw.thecloso.com/contact`
- `https://wrhw.thecloso.com/services/server-installation`

## 9. Updating after future changes

```bash
cd ~/WHRF
git pull
sudo DOMAIN=wrhw.thecloso.com bash scripts/deploy-to-ec2.sh
sudo nginx -t
sudo systemctl reload nginx
```

## 10. If you really have a backend on this EC2

This repo does not include backend server code. If your backend is a separate app on the same EC2 instance:

1. Start it on a private port such as `3000`
2. Uncomment the `/api/` proxy block in `deploy/nginx/wrhw.thecloso.com.conf`
3. Reload Nginx
4. Update the frontend to call `/api/...`

Example proxy target inside the config:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
