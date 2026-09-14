#!/usr/bin/env bash
# Build the site and sync it to the Synology web root.
#
# Usage:  DEPLOY_TARGET=user@synology:/volume1/web/anthropy ./scripts/deploy.sh
#
# The site is fully static: moving hosts later means changing DEPLOY_TARGET
# and repointing DNS. Nothing in the build is tied to the current host.
set -euo pipefail

if [[ -z "${DEPLOY_TARGET:-}" ]]; then
  echo "error: DEPLOY_TARGET is not set." >&2
  echo "example: DEPLOY_TARGET=user@synology:/volume1/web/anthropy $0" >&2
  exit 1
fi

echo "==> Running tests"
npm run test:unit

echo "==> Building"
npm run build

echo "==> Syncing dist/ to ${DEPLOY_TARGET}"
rsync -av --delete dist/ "${DEPLOY_TARGET}/"

echo "==> Done."
