#!/bin/bash
# Vercel Ignore Build Step: exit 0 = skip build, exit 1 = run build

if [[ "$VERCEL_ENV" == "production" ]]; then
    echo "Production build - proceeding"
    exit 1
fi
# Preview: build for both branch pushes and PRs (previously only PRs had VERCEL_GIT_PULL_REQUEST_ID, so branch pushes were skipped)
echo "Preview build - proceeding"
exit 1