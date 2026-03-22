"""Symptom checker router - POST /api/ai/symptoms."""

from fastapi import APIRouter, HTTPException
from src.models.schemas import SymptomCheckRequest, SymptomCheckResponse
from src.ml.symptom_engine import check_symptoms

router = APIRouter()


@router.post(
    "/symptoms",
    response_model=SymptomCheckResponse,
    summary="Analyse symptoms and recommend specialties",
    description=(
        "Accepts a list of symptom identifiers along with patient demographics "
        "and returns recommended medical specialties, urgency level, and suggested actions."
    ),
)
async def analyse_symptoms(request: SymptomCheckRequest) -> SymptomCheckResponse:
    """Run the symptom analysis engine."""
    try:
        result = check_symptoms(
            symptoms=request.symptoms,
            age=request.age,
            gender=request.gender.value,
            additional_notes=request.additional_notes,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Symptom analysis failed: {str(exc)}")
