#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "  MedAssist Global - Project Setup"
echo "======================================"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ---------- Environment Files ----------
echo ""
echo "[1/5] Creating .env files from examples..."

for dir in "$ROOT_DIR" "$ROOT_DIR/backend" "$ROOT_DIR/web" "$ROOT_DIR/ai-services"; do
  if [ -f "$dir/.env.example" ] && [ ! -f "$dir/.env" ]; then
    cp "$dir/.env.example" "$dir/.env"
    echo "  Created $dir/.env"
  fi
done

# ---------- Backend ----------
echo ""
echo "[2/5] Installing backend dependencies..."
if [ -d "$ROOT_DIR/backend" ] && [ -f "$ROOT_DIR/backend/package.json" ]; then
  cd "$ROOT_DIR/backend"
  npm install
  if [ -f prisma/schema.prisma ]; then
    npx prisma generate
    echo "  Prisma client generated."
  fi
else
  echo "  Backend directory not found, skipping."
fi

# ---------- Web ----------
echo ""
echo "[3/5] Installing web dependencies..."
if [ -d "$ROOT_DIR/web" ] && [ -f "$ROOT_DIR/web/package.json" ]; then
  cd "$ROOT_DIR/web"
  npm install
else
  echo "  Web directory not found, skipping."
fi

# ---------- AI Services ----------
echo ""
echo "[4/5] Setting up AI services..."
if [ -d "$ROOT_DIR/ai-services" ]; then
  cd "$ROOT_DIR/ai-services"
  if command -v python3 &>/dev/null; then
    python3 -m venv venv 2>/dev/null || true
    if [ -f venv/bin/activate ]; then
      source venv/bin/activate
    elif [ -f venv/Scripts/activate ]; then
      source venv/Scripts/activate
    fi
    pip install -r requirements.txt
    echo "  Training ML models..."
    python -m src.ml.train_models
  else
    echo "  Python3 not found. Please install Python 3.11+ and run:"
    echo "    cd ai-services && pip install -r requirements.txt"
  fi
else
  echo "  AI services directory not found, skipping."
fi

# ---------- Done ----------
echo ""
echo "[5/5] Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env files with your configuration"
echo "  2. Start development:  make dev"
echo "  3. Or use Docker:      make deploy"
echo ""
