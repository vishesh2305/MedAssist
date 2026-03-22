#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "  MedAssist Global - Database Seed"
echo "======================================"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -d "$ROOT_DIR/backend" ] && [ -f "$ROOT_DIR/backend/package.json" ]; then
  cd "$ROOT_DIR/backend"

  # Run Prisma seed if configured
  if [ -f prisma/seed.ts ] || [ -f prisma/seed.js ]; then
    echo "Running Prisma seed..."
    npx prisma db seed
    echo "Seed complete."
  else
    echo "No seed file found at backend/prisma/seed.ts or seed.js"
    echo "Create one and add it to your package.json prisma.seed config."
  fi
else
  echo "Backend directory not found."
  exit 1
fi
