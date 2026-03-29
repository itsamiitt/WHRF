#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  sudo bash scripts/publish-site.sh --domain wrhw.thecloso.com --email you@example.com

Options:
  --domain   Required. Domain to publish.
  --email    Optional. Email for Let's Encrypt. If omitted, HTTP-only config is installed.
EOF
}

DOMAIN=""
EMAIL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="${2:-}"
      shift 2
      ;;
    --email)
      EMAIL="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${DOMAIN}" ]]; then
  echo "--domain is required." >&2
  usage
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TARGET_ROOT="/var/www/${DOMAIN}"
CURRENT_DIR="${TARGET_ROOT}/current"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}.conf"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

install_packages() {
  if ! command -v nginx >/dev/null 2>&1 || ! command -v certbot >/dev/null 2>&1 || ! command -v rsync >/dev/null 2>&1; then
    apt update
    apt install -y nginx certbot rsync
  fi
  systemctl enable --now nginx
}

write_http_config() {
  cat <<EOF | tee "${NGINX_CONF}" >/dev/null
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${CURRENT_DIR};
    index index.html;

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;

    client_max_body_size 10m;

    location = /index.html {
        return 301 /;
    }

    location /.well-known/acme-challenge/ {
        root ${CURRENT_DIR};
    }

    location / {
        try_files \$uri \$uri.html \$uri/ \$uri/index.html =404;
    }

    location ~* \.(?:css|js|mjs|jpg|jpeg|gif|png|svg|webp|ico|woff2?|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
EOF
}

write_https_config() {
  cat <<EOF | tee "${NGINX_CONF}" >/dev/null
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${CURRENT_DIR};
    index index.html;

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;

    client_max_body_size 10m;

    location /.well-known/acme-challenge/ {
        root ${CURRENT_DIR};
    }

    location = /index.html {
        return 301 /;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${DOMAIN};

    root ${CURRENT_DIR};
    index index.html;

    access_log /var/log/nginx/${DOMAIN}.ssl.access.log;
    error_log /var/log/nginx/${DOMAIN}.ssl.error.log;

    client_max_body_size 10m;

    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;

    location = /index.html {
        return 301 /;
    }

    location / {
        try_files \$uri \$uri.html \$uri/ \$uri/index.html =404;
    }

    location ~* \.(?:css|js|mjs|jpg|jpeg|gif|png|svg|webp|ico|woff2?|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
EOF
}

enable_site() {
  ln -sfn "${NGINX_CONF}" "/etc/nginx/sites-enabled/${DOMAIN}.conf"
  rm -f /etc/nginx/sites-enabled/default
}

echo "Publishing ${DOMAIN} from ${REPO_ROOT}"

install_packages
DOMAIN="${DOMAIN}" bash "${SCRIPT_DIR}/deploy-to-ec2.sh"

write_http_config
enable_site
nginx -t
systemctl reload nginx

if [[ -n "${EMAIL}" ]]; then
  certbot certonly --webroot -w "${CURRENT_DIR}" -d "${DOMAIN}" --agree-tos --non-interactive -m "${EMAIL}" --keep-until-expiring
fi

if [[ -f "${CERT_DIR}/fullchain.pem" && -f "${CERT_DIR}/privkey.pem" ]]; then
  write_https_config
  nginx -t
  systemctl reload nginx
  curl -Ik --resolve "${DOMAIN}:443:127.0.0.1" "https://${DOMAIN}/" >/dev/null
  echo "HTTPS publish complete for ${DOMAIN}"
else
  curl -I --resolve "${DOMAIN}:80:127.0.0.1" "http://${DOMAIN}/" >/dev/null
  echo "HTTP publish complete for ${DOMAIN}"
  echo "Tip: rerun with --email you@example.com to enable Let's Encrypt."
fi
