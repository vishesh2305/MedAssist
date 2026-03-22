"""Cost prediction router - POST /api/ai/predict-cost."""

from fastapi import APIRouter, HTTPException
from src.models.schemas import CostPredictionRequest, CostPredictionResponse
from src.ml.cost_model import CostPredictor

router = APIRouter()

# Singleton predictor instance (loads model once)
_predictor: CostPredictor | None = None


def _get_predictor() -> CostPredictor:
    global _predictor
    if _predictor is None:
        _predictor = CostPredictor()
    return _predictor


@router.post(
    "/predict-cost",
    response_model=CostPredictionResponse,
    summary="Predict medical procedure cost",
    description=(
        "Estimates the cost of a medical procedure in a given city and hospital tier. "
        "Uses a trained ML model with a table-lookup fallback."
    ),
)
async def predict_cost(request: CostPredictionRequest) -> CostPredictionResponse:
    try:
        predictor = _get_predictor()
        result = predictor.predict(
            procedure_type=request.procedure_type,
            city=request.city,
            hospital_tier=request.hospital_tier.value,
        )
        return CostPredictionResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Cost prediction failed: {str(exc)}")
