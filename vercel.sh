#!/bin/bash

if [[ "$VERCEL_ENV" == "production" ]]; then
    echo "Production build - proceeding"
    exit 1  # Continue with build
else
    if [[ -z "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
        echo "SKIPPING BUILD !!!!!! THIS IS A REGULAR COMMIT"
        exit 0  # Skip build
    fi
    echo "PR deployment - proceeding"
    exit 1  # Continue with build
fi