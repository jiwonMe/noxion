#!/bin/bash
set -e

PACKAGES=(
  "packages/core"
  "packages/notion-renderer"
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
FAILED=0
for PKG in "${PACKAGES[@]}"; do
  NAME=$(node -p "require('./$PKG/package.json').name")
  VERSION=$(node -p "require('./$PKG/package.json').version")

  EXISTING=$(npm view "$NAME@$VERSION" version 2>/dev/null || true)
  if [ "$EXISTING" = "$VERSION" ]; then
    echo "Skipping $NAME@$VERSION (already published)"
    continue
  fi

  echo "Publishing $NAME@$VERSION..."
  if ! (cd "$PKG" && npm publish --access public --userconfig "$(pwd)/../../.npmrc.release"); then
    echo "Failed to publish $NAME@$VERSION"
    FAILED=1
  fi
done

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "Some packages failed to publish!"
  exit 1
fi

rm -f .npmrc.release
echo ""
echo "All packages published!"
