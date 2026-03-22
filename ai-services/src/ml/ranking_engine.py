"""Hospital ranking algorithm with configurable weights."""

from __future__ import annotations

import math
from src.models.schemas import (
    Location,
    UserPreferences,
    HospitalInput,
    RankedHospital,
    RankHospitalsResponse,
)

# Default weights (must sum to 1.0)
DEFAULT_WEIGHTS = {
    "distance": 0.25,
    "rating": 0.20,
    "price": 0.15,
    "language": 0.15,
    "specialty": 0.15,
    "emergency": 0.10,
}

# When user requests emergency, shift weight heavily
EMERGENCY_WEIGHTS = {
    "distance": 0.35,
    "rating": 0.10,
    "price": 0.05,
    "language": 0.05,
    "specialty": 0.10,
    "emergency": 0.35,
}


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return distance in kilometres between two lat/lon points."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _distance_score(distance_km: float, max_km: float = 50.0) -> float:
    """Closer is better. Score 1.0 at 0 km, approaching 0 at max_km."""
    return max(0.0, 1.0 - (distance_km / max_km))


def _rating_score(rating: float) -> float:
    """Normalize 0-5 rating to 0-1."""
    return rating / 5.0


def _price_score(hospital_cost_level: float, max_budget: float | None) -> float:
    """Lower cost is better. If user has a budget, penalize above-budget hospitals."""
    base = 1.0 - hospital_cost_level  # cheaper = higher score
    if max_budget is not None and hospital_cost_level > max_budget:
        penalty = (hospital_cost_level - max_budget) * 2
        base = max(0.0, base - penalty)
    return base


def _language_score(hospital_languages: list[str], preferred: str | None) -> float:
    """1.0 if preferred language is spoken, 0.3 if English available, else 0.0."""
    if preferred is None:
        return 0.5  # neutral
    langs_lower = [l.lower() for l in hospital_languages]
    if preferred.lower() in langs_lower:
        return 1.0
    if "english" in langs_lower:
        return 0.3
    return 0.0


def _specialty_score(hospital_specs: list[str], required: str | None) -> float:
    """1.0 if required specialty is available, else 0.0."""
    if required is None:
        return 0.5  # neutral
    specs_lower = [s.lower() for s in hospital_specs]
    if required.lower() in specs_lower:
        return 1.0
    return 0.0


def _emergency_score(has_emergency: bool, emergency_only: bool) -> float:
    """If user needs emergency, hospitals without ER get 0.0."""
    if emergency_only:
        return 1.0 if has_emergency else 0.0
    return 0.7 if has_emergency else 0.3


def rank_hospitals(
    user_location: Location,
    user_preferences: UserPreferences,
    hospitals: list[HospitalInput],
) -> RankHospitalsResponse:
    """Score and rank a list of hospitals based on user location and preferences."""

    weights = EMERGENCY_WEIGHTS if user_preferences.emergency_only else DEFAULT_WEIGHTS

    scored: list[dict] = []

    for h in hospitals:
        # Apply hard filters first
        if user_preferences.min_rating is not None and h.rating < user_preferences.min_rating:
            continue
        if user_preferences.emergency_only and not h.has_emergency:
            continue

        dist_km = _haversine(
            user_location.latitude, user_location.longitude,
            h.latitude, h.longitude,
        )

        d_score = _distance_score(dist_km)
        r_score = _rating_score(h.rating)
        p_score = _price_score(h.avg_cost_level, user_preferences.max_budget)
        l_score = _language_score(h.languages_spoken, user_preferences.preferred_language)
        s_score = _specialty_score(h.specialties, user_preferences.required_specialty)
        e_score = _emergency_score(h.has_emergency, user_preferences.emergency_only)

        overall = (
            weights["distance"] * d_score
            + weights["rating"] * r_score
            + weights["price"] * p_score
            + weights["language"] * l_score
            + weights["specialty"] * s_score
            + weights["emergency"] * e_score
        )

        scored.append({
            "id": h.id,
            "name": h.name,
            "overall_score": round(overall, 4),
            "distance_km": round(dist_km, 2),
            "distance_score": round(d_score, 4),
            "rating_score": round(r_score, 4),
            "price_score": round(p_score, 4),
            "language_score": round(l_score, 4),
            "specialty_score": round(s_score, 4),
            "emergency_score": round(e_score, 4),
        })

    # Sort descending by overall score
    scored.sort(key=lambda x: x["overall_score"], reverse=True)
    for idx, item in enumerate(scored, 1):
        item["rank"] = idx

    ranked = [RankedHospital(**s) for s in scored]

    filters_applied = {}
    if user_preferences.min_rating is not None:
        filters_applied["min_rating"] = user_preferences.min_rating
    if user_preferences.emergency_only:
        filters_applied["emergency_only"] = True
    if user_preferences.required_specialty:
        filters_applied["required_specialty"] = user_preferences.required_specialty
    if user_preferences.preferred_language:
        filters_applied["preferred_language"] = user_preferences.preferred_language

    return RankHospitalsResponse(
        ranked_hospitals=ranked,
        total_hospitals=len(ranked),
        filters_applied=filters_applied,
    )
