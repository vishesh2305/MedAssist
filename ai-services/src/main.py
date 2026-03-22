"""MedAssist Global AI Services - FastAPI Application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.routers import symptom_checker, chat_translator, cost_predictor, hospital_ranker

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI-powered microservices for MedAssist Global - Tourist Medical Assistance Platform. "
        "Provides symptom checking, medical translation, cost prediction, and hospital ranking."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptom_checker.router, prefix="/api/ai", tags=["Symptom Checker"])
app.include_router(chat_translator.router, prefix="/api/ai", tags=["Chat & Translation"])
app.include_router(cost_predictor.router, prefix="/api/ai", tags=["Cost Prediction"])
app.include_router(hospital_ranker.router, prefix="/api/ai", tags=["Hospital Ranking"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service information."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for load balancers and orchestrators."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
