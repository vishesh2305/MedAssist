#!/usr/bin/env bash
set -euo pipefail

echo "======================================"
echo "  MedAssist Global - Development Mode"
echo "======================================"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Start infrastructure with Docker
echo ""
echo "Starting PostgreSQL and Redis..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d postgres redis

echo "Waiting for services to be healthy..."
sleep 3

# Check health
docker compose -f "$ROOT_DIR/docker-compose.yml" ps

echo ""
echo "Infrastructure is ready!"
echo ""
echo "Start each service in a separate terminal:"
echo ""
echo "  Backend:      cd backend && npm run dev"
echo "  Web:          cd web && npm run dev"
echo "  AI Services:  cd ai-services && uvicorn src.main:app --reload --port 8000"
echo ""
echo "Or run all with Docker:"
echo "  docker compose up"
echo ""
echo "Service URLs:"
echo "  Web:          http://localhost:3000"
echo "  Backend API:  http://localhost:4000"
echo "  AI Services:  http://localhost:8000"
echo "  AI Docs:      http://localhost:8000/docs"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"
echo ""
