#!/bin/bash
set -e

PACKAGES=(
  "packages/core"
  "packages/adapter-nextjs"
  "packages/renderer"
  "packages/create-noxion"
)

if [ -z "$NPM_TOKEN" ]; then
  echo "Error: NPM_TOKEN is not set."
  echo "Create an Automation token at https://www.npmjs.com/settings/~/tokens"
  exit 1
fi

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc.release

echo "Building packages..."
bunx turbo build --filter='./packages/*'

echo ""
for PKG in "${PACKAGES[@]}"; do
  NAME=$(node -p "require('./$PKG/package.json').name")
  VERSION=$(node -p "require('./$PKG/package.json').version")
  echo "Publishing $NAME@$VERSION..."
  (cd "$PKG" && npm publish --access public --userconfig "$(pwd)/../../.npmrc.release")
done

rm -f .npmrc.release
echo ""
echo "All packages published!"
