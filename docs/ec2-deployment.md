# EC2 Deployment Guide

This guide is written for this repository as it exists today:

- The app is a Next.js application that builds with `pnpm build` and runs with `next start` on port `5000`.
- The database is PostgreSQL via Prisma.
- Authentication is credentials-based NextAuth and the admin login page is `/admin/login`.
- Seeded admin, editor, and sales users come from environment variables.

Relevant repo references:

- [`package.json`](/c:/Users/Administrator/Downloads/WHRF/package.json#L6)
- [`prisma/schema.prisma`](/c:/Users/Administrator/Downloads/WHRF/prisma/schema.prisma#L5)
- [`prisma/seed.ts`](/c:/Users/Administrator/Downloads/WHRF/prisma/seed.ts#L41)
- [`lib/auth/options.ts`](/c:/Users/Administrator/Downloads/WHRF/lib/auth/options.ts#L7)
- [`app/api/health/route.ts`](/c:/Users/Administrator/Downloads/WHRF/app/api/health/route.ts#L7)

## Assumptions

- EC2 OS: Ubuntu 22.04 or 24.04
- App path on server: `/var/www/whrf`
- Linux user running the app: `ubuntu`
- Public domain: `your-domain.com`
- Reverse proxy: Nginx
- App listens internally on `127.0.0.1:5000`

If your EC2 instance uses Amazon Linux instead of Ubuntu, the application commands stay nearly the same, but the package installation commands will differ.

## Recommended Topology

Use this layout:

1. Nginx handles ports `80` and `443`.
2. The Next.js app runs on `127.0.0.1:5000`.
3. PostgreSQL runs either:
   - on the same EC2 instance for the fastest setup, or
   - on Amazon RDS for a cleaner production setup.
4. A `systemd` service keeps the app running after reboot.

## AWS Prerequisites

Before logging into EC2, make sure:

1. Your EC2 security group allows inbound `22`, `80`, and `443`.
2. Do not expose `5432` publicly if PostgreSQL is local on EC2.
3. Your domain A record points to the EC2 public IP.

## One-Time Server Bootstrap

Run these once on the EC2 server:

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y nginx postgresql postgresql-contrib git build-essential ca-certificates curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm -v
```

## Database Setup

### Option A: PostgreSQL on the Same EC2 Instance

This is the quickest way to get the app live.

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo -u postgres psql <<'SQL'
CREATE USER whrf_app WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE whrf_prod OWNER whrf_app;
GRANT ALL PRIVILEGES ON DATABASE whrf_prod TO whrf_app;
SQL
```

Use this style of connection string in `.env`:

```env
DATABASE_URL="postgresql://whrf_app:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/whrf_prod?schema=public"
```

### Option B: Amazon RDS PostgreSQL

This is the better production choice if you want managed backups and cleaner separation.

1. Create a PostgreSQL RDS instance in the same VPC.
2. Allow inbound `5432` from the EC2 security group only.
3. Use the RDS endpoint in `DATABASE_URL`.

Example:

```env
DATABASE_URL="postgresql://whrf_app:CHANGE_ME_STRONG_PASSWORD@your-rds-endpoint.amazonaws.com:5432/whrf_prod?schema=public"
```

If you use RDS, skip the local PostgreSQL creation commands above.

## Environment File

This repo already has a local example in [`.env.example`](/c:/Users/Administrator/Downloads/WHRF/.env.example#L1). For production, start from [`.env.production.example`](/c:/Users/Administrator/Downloads/WHRF/.env.production.example).

On the server:

```bash
cd /var/www/whrf
cp .env.production.example .env
nano .env
```

Use values like this:

```env
DATABASE_URL="postgresql://whrf_app:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/whrf_prod?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="PASTE_A_LONG_RANDOM_SECRET_HERE"
APP_URL="https://your-domain.com"
UPLOAD_DIR="./public/uploads"
SEED_ADMIN_EMAIL="admin@your-domain.com"
SEED_ADMIN_PASSWORD="CHANGE_ME_ADMIN_PASSWORD"
SEED_EDITOR_EMAIL="editor@your-domain.com"
SEED_EDITOR_PASSWORD="CHANGE_ME_EDITOR_PASSWORD"
SEED_SALES_EMAIL="sales@your-domain.com"
SEED_SALES_PASSWORD="CHANGE_ME_SALES_PASSWORD"
```

Generate a strong `NEXTAUTH_SECRET` with one of these:

```bash
openssl rand -base64 32
```

or:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Important notes:

1. `NEXTAUTH_URL` should be the final public URL, ideally HTTPS.
2. `APP_URL` is safe to keep equal to `NEXTAUTH_URL`.
3. `UPLOAD_DIR` can stay as `./public/uploads`.
4. If `DATABASE_URL` is missing, public pages can still fall back to static content, but the database-backed CMS, CRM, and auth flow will not work correctly.

## First-Time App Setup

If the repo is not cloned yet:

```bash
sudo mkdir -p /var/www/whrf
sudo chown -R ubuntu:ubuntu /var/www/whrf
cd /var/www/whrf
git clone <YOUR_REPOSITORY_URL> .
```

Create the uploads directory once:

```bash
cd /var/www/whrf
mkdir -p public/uploads
chmod 755 public/uploads
```

Install dependencies and prepare Prisma:

```bash
cd /var/www/whrf
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:push
pnpm build
```

Seed the initial users and starter content once:

```bash
cd /var/www/whrf
pnpm prisma:seed
```

Important seed behavior from [`prisma/seed.ts`](/c:/Users/Administrator/Downloads/WHRF/prisma/seed.ts#L17):

1. It creates or updates the seeded users every time it runs.
2. It will reset the seeded admin, editor, and sales passwords to whatever is in `.env`.
3. Run it on the first deployment, or later only when you intentionally want to refresh those seeded credentials/content.

Use `pnpm prisma:push` for this repo, not `prisma migrate deploy`, because the repository currently does not include checked-in Prisma migrations.

## Create the systemd Service

Create a service so the app starts on boot and restarts on failure:

```bash
sudo tee /etc/systemd/system/whrf.service > /dev/null <<'EOF'
[Unit]
Description=WHRF Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/whrf
Environment=NODE_ENV=production
EnvironmentFile=/var/www/whrf/.env
ExecStart=/usr/bin/node /var/www/whrf/node_modules/next/dist/bin/next start -p 5000 -H 0.0.0.0
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable whrf
sudo systemctl start whrf
sudo systemctl status whrf --no-pager
```

## Nginx Reverse Proxy

Create the Nginx site config:

```bash
sudo tee /etc/nginx/sites-available/whrf > /dev/null <<'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/whrf /etc/nginx/sites-enabled/whrf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Enable HTTPS

After DNS is pointing correctly:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

After HTTPS is working, confirm `.env` uses:

```env
NEXTAUTH_URL="https://your-domain.com"
APP_URL="https://your-domain.com"
```

Then reload the app:

```bash
sudo systemctl restart whrf
```

## Exact Commands After `git pull`

These are the repeatable deployment commands you asked for after pulling new code:

```bash
cd /var/www/whrf
git pull origin main
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:push
pnpm build
sudo systemctl restart whrf
sudo systemctl status whrf --no-pager
curl -fsS http://127.0.0.1:5000/api/health
```

If Nginx is already configured and unchanged, you do not need to restart Nginx on every deploy.

Also note:

1. Do not run `pnpm prisma:seed` on every deploy unless you intentionally want the seeded user passwords reset from `.env`.
2. Because this repo currently uses `prisma db push` rather than checked-in migrations, take a database backup before schema changes in production.

## Safe Deploy Sequence

Use this order for production updates:

1. Pull code.
2. Install dependencies.
3. Back up the database if schema changed.
4. Run `pnpm prisma:push`.
5. Build the app.
6. Restart the service.
7. Verify health and login.

Example backup command for local PostgreSQL:

```bash
mkdir -p ~/db-backups
pg_dump "postgresql://whrf_app:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/whrf_prod" > ~/db-backups/whrf-$(date +%F-%H%M%S).sql
```

## Verification Checklist

Run these after deployment:

```bash
curl -I https://your-domain.com
curl https://your-domain.com/api/health
sudo systemctl status whrf --no-pager
sudo systemctl status nginx --no-pager
```

Then verify in the browser:

1. Home page loads.
2. Admin login page opens at `https://your-domain.com/admin/login`.
3. Login works with the seeded admin user from `.env`.
4. A test lead submission succeeds.

## Troubleshooting

If the app does not start:

```bash
journalctl -u whrf -n 100 --no-pager
```

If Nginx is failing:

```bash
sudo nginx -t
journalctl -u nginx -n 100 --no-pager
```

If Prisma cannot connect:

1. Re-check `DATABASE_URL`.
2. Confirm PostgreSQL is running.
3. Confirm the database user and password are correct.
4. If using RDS, confirm the RDS security group allows the EC2 instance.

If Prisma says `Prisma config detected, skipping environment variable loading` and then reports `Environment variable not found: DATABASE_URL`, load the env file into the current shell and rerun the Prisma command:

```bash
cd /var/www/whrf
set -a
source .env
set +a
printenv DATABASE_URL
pnpm prisma:push
pnpm prisma:seed
```

Use that workaround on older checkouts. Newer checkouts include an update to [`prisma.config.ts`](/c:/Users/Administrator/Downloads/WHRF/prisma.config.ts#L1) that loads `.env` for Prisma CLI commands automatically.

If `/api/health` shows `"database":"not-configured"`, the app started without a valid `DATABASE_URL` loaded into the environment.

## Repo-Specific Notes

These details come directly from the current codebase:

1. Production runtime listens on port `5000` via the `start` script in [`package.json`](/c:/Users/Administrator/Downloads/WHRF/package.json#L9).
2. The Prisma datasource is PostgreSQL in [`prisma/schema.prisma`](/c:/Users/Administrator/Downloads/WHRF/prisma/schema.prisma#L5).
3. Seeded users are controlled by `SEED_ADMIN_*`, `SEED_EDITOR_*`, and `SEED_SALES_*` in [`prisma/seed.ts`](/c:/Users/Administrator/Downloads/WHRF/prisma/seed.ts#L41).
4. NextAuth uses credential login and the custom sign-in page is `/admin/login` in [`lib/auth/options.ts`](/c:/Users/Administrator/Downloads/WHRF/lib/auth/options.ts#L11).
5. The health route is available at `/api/health` in [`app/api/health/route.ts`](/c:/Users/Administrator/Downloads/WHRF/app/api/health/route.ts#L7).
