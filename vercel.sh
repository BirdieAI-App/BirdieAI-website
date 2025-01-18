if [[ $VERCEL_GIT_PULL_REQUEST == "false" || $VERCEL_GIT_COMMIT_REF != "main" ]]; then
  exit 0
fi
