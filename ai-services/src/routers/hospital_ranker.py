"""Hospital ranking router - POST /api/ai/rank-hospitals."""

from fastapi import APIRouter, HTTPException
from src.models.schemas import RankHospitalsRequest, RankHospitalsResponse
from src.ml.ranking_engine import rank_hospitals

router = APIRouter()


@router.post(
    "/rank-hospitals",
    response_model=RankHospitalsResponse,
    summary="Rank hospitals by user preferences",
    description=(
        "Accepts a user location, preferences, and a list of hospitals, "
        "then returns them ranked by a weighted scoring algorithm."
    ),
)
async def rank_hospitals_endpoint(request: RankHospitalsRequest) -> RankHospitalsResponse:
    try:
        result = rank_hospitals(
            user_location=request.user_location,
            user_preferences=request.user_preferences,
            hospitals=request.hospitals,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Hospital ranking failed: {str(exc)}")
