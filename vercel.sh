if [[ $VERCEL_ENV == "production"  ]] ; then 
  exit 1
else
    git log -1 --pretty=oneline --abbrev-commit | grep -w "runPreview" && exit 1 || exit 0
fi