#!/bin/bash
set -euo pipefail

echo "=== Checking for hardcoded secrets in tracked files ==="
git grep -InE "(api[_-]?key|secret|password|firebase\\.key)\\s*[:=]\\s*['\"][A-Za-z0-9*\\-]{10,}" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!node_modules' || true

echo "=== Checking git history for leaked .env files ==="
git log --all --full-history -- "*.env" "*serviceAccountKey*" || true

echo "=== Confirm .env is gitignored ==="
git check-ignore -v .env || echo "WARNING: .env is NOT gitignored!"
