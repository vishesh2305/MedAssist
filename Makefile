.PHONY: setup dev build test deploy clean db-migrate db-seed ai-train ai-test lint help

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---- Setup ----
setup: ## Initial project setup
	@bash scripts/setup.sh

# ---- Development ----
dev: ## Start all services in development mode
	@bash scripts/dev.sh

dev-ai: ## Start only AI services in dev mode
	cd ai-services && uvicorn src.main:app --reload --port 8000

dev-backend: ## Start only backend in dev mode
	cd backend && npm run dev

dev-web: ## Start only web app in dev mode
	cd web && npm run dev

# ---- Build ----
build: ## Build all Docker images
	docker compose build

build-ai: ## Build AI services image
	docker compose build ai-services

build-backend: ## Build backend image
	docker compose build backend

build-web: ## Build web image
	docker compose build web

# ---- Run ----
up: ## Start all services with Docker Compose
	docker compose up -d

down: ## Stop all services
	docker compose down

logs: ## Tail logs from all services
	docker compose logs -f

restart: ## Restart all services
	docker compose restart

# ---- Testing ----
test: test-ai test-backend ## Run all tests

test-ai: ## Run AI service tests
	cd ai-services && python -m pytest tests/ -v

test-backend: ## Run backend tests
	cd backend && npm test

lint: ## Lint all code
	cd ai-services && python -m ruff check src/ tests/ || true
	cd backend && npm run lint || true

# ---- Database ----
db-migrate: ## Run database migrations
	cd backend && npx prisma migrate deploy

db-seed: ## Seed the database
	@bash scripts/seed.sh

db-studio: ## Open Prisma Studio
	cd backend && npx prisma studio

db-reset: ## Reset database (destructive!)
	cd backend && npx prisma migrate reset --force

# ---- AI Models ----
ai-train: ## Train ML models
	cd ai-services && python -m src.ml.train_models

# ---- Deploy ----
deploy: build ## Deploy with Docker Compose
	docker compose up -d
	@echo "Deployment complete. Services:"
	@echo "  Web:     http://localhost:3000"
	@echo "  API:     http://localhost:4000"
	@echo "  AI:      http://localhost:8000"
	@echo "  Proxy:   http://localhost:80"

# ---- Cleanup ----
clean: ## Remove build artifacts and containers
	docker compose down -v --remove-orphans
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name dist -exec rm -rf {} + 2>/dev/null || true
	rm -rf ai-services/trained_models/
	@echo "Cleaned up."
