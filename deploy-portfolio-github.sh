#!/usr/bin/env bash
set -euo pipefail

GITHUB_USER="HAL9000si-fi"
REPO_NAME="HAL9000si-fi.github.io"
CUSTOM_DOMAIN="halhabeel.co"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "Deploying portfolio to GitHub Pages"
echo "Repo: ${GITHUB_USER}/${REPO_NAME}"
echo "Domain: ${CUSTOM_DOMAIN}"
echo ""

if [ ! -f "index.html" ]; then
  echo "ERROR: index.html not found. Run this from the website root folder."
  exit 1
fi

PRIVATE_MATCHES="$(find . -iname "*payslip*" -o -iname "*bank*" -o -iname "*passport*" -o -iname "*driving*" -o -iname "*license*" -o -iname "*licence*" -o -iname "*invoice*" || true)"

if [ -n "$PRIVATE_MATCHES" ]; then
  echo "ERROR: Possible private files found:"
  echo "$PRIVATE_MATCHES"
  echo ""
  echo "Remove these before publishing."
  exit 1
fi

if [ -f "contact.php" ]; then
  echo "WARNING: contact.php found."
  echo "GitHub Pages is static hosting, so PHP will not run server-side."
  echo "The file can be published, but your contact form will not work unless it uses an external form service/API."
  echo ""
fi

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is not installed."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI is not installed."
  echo "Install it with:"
  echo "  brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  gh auth login
fi

AUTH_USER="$(gh api user --jq '.login')"

if [ "$AUTH_USER" != "$GITHUB_USER" ]; then
  echo "ERROR: GitHub CLI is logged in as '${AUTH_USER}', not '${GITHUB_USER}'."
  echo "Run:"
  echo "  gh auth switch"
  exit 1
fi

git init
git branch -M main

printf "%s\n" "$CUSTOM_DOMAIN" > CNAME

git add .

if git diff --cached --quiet; then
  echo "No files to commit."
else
  git commit -m "Deploy portfolio website"
fi

if gh repo view "${GITHUB_USER}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "GitHub repo already exists."
else
  gh repo create "${GITHUB_USER}/${REPO_NAME}" --public --source=. --remote=origin
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REMOTE_URL"
fi

git push -u origin main

echo ""
echo "Repository created/pushed:"
echo "https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "GitHub Pages URL:"
echo "https://${REPO_NAME}"
echo ""
echo "Custom domain file created:"
echo "CNAME → ${CUSTOM_DOMAIN}"
echo ""
echo "Next: add these DNS records for halhabeel.co:"
echo ""
echo "A     @     185.199.108.153"
echo "A     @     185.199.109.153"
echo "A     @     185.199.110.153"
echo "A     @     185.199.111.153"
echo "CNAME www   ${REPO_NAME}"
echo ""
echo "Then go to:"
echo "GitHub repo → Settings → Pages"
echo ""
echo "Set:"
echo "Source: Deploy from a branch"
echo "Branch: main"
echo "Folder: /root"
echo "Custom domain: ${CUSTOM_DOMAIN}"
echo "Enforce HTTPS: enabled once available"
