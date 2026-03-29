#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-wrhw.thecloso.com}"
TARGET_ROOT="${TARGET_ROOT:-/var/www/${DOMAIN}}"
CURRENT_DIR="${TARGET_ROOT}/current"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not installed."
  exit 1
fi

RSYNC_ARGS=(
  -av
  --delete
  --exclude=.git/
  --exclude=README.md
  --exclude=implementation_plan.md
  --exclude=scripts/
  --exclude=aws/
  --exclude=deploy/
)

echo "Deploying ${REPO_ROOT} -> ${CURRENT_DIR}"
echo "Deployment mode: full site"

sudo mkdir -p "${CURRENT_DIR}"
sudo rsync "${RSYNC_ARGS[@]}" "${REPO_ROOT}/" "${CURRENT_DIR}/"
sudo find "${TARGET_ROOT}" -type d -exec chmod 755 {} \;
sudo find "${TARGET_ROOT}" -type f -exec chmod 644 {} \;

echo "Deployment finished."
echo "Web root: ${CURRENT_DIR}"
