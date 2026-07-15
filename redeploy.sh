#!/bin/bash
set -e

echo "Building..."
npm run build

echo "Deploying to Cloudflare Pages..."
CLOUDFLARE_ACCOUNT_ID=21e4b95cd9bb4d56529ebfa5e42a3fbb \
  npx wrangler pages deploy ./dist/client \
  --project-name=ayurvedic-physician \
  --commit-dirty=true

echo "Done!"
