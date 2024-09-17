#!/bin/bash

echo -e "\nupdate version in manifest.json/package.json and version.json"

npm run version

current_version=$(node -pe "require('./manifest.json').version")
package_version=$(node -pe "require('./package.json').version")

echo "check version"

if [ "$current_version" != "$package_version" ]; then
    echo "Version mismatch between manifest.json and package.json. Exiting."
    exit 1
fi

if git rev-parse "$current_version" >/dev/null 2>&1; then
    echo "Tag $current_version already exists. Skipping push."
    exit 0
fi

echo "commit and push all changes with version"

git commit -am "chore(Release): :bookmark: to version $current_version"

git tag -a $current_version -m "$current_version"

git push

git push origin $current_version