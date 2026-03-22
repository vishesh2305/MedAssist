"""Symptom-to-specialty mapping engine with urgency classification."""

from __future__ import annotations

from collections import Counter
from src.utils.medical_data import (
    SYMPTOM_SPECIALTY_MAP,
    URGENCY_THRESHOLDS,
    AGE_URGENCY_MODIFIER,
    URGENCY_ACTIONS,
    SPECIALTY_DESCRIPTIONS,
)
from src.models.schemas import (
    UrgencyLevel,
    SpecialtyRecommendation,
    SymptomCheckResponse,
)


def _age_group(age: int) -> str:
    if age <= 12:
        return "child"
    elif age <= 17:
        return "adolescent"
    elif age <= 64:
        return "adult"
    return "elderly"


def _classify_urgency(score: float) -> UrgencyLevel:
    for level, (lo, hi) in URGENCY_THRESHOLDS.items():
        if lo <= score < hi:
            return UrgencyLevel(level)
    return UrgencyLevel.EMERGENCY


def check_symptoms(
    symptoms: list[str],
    age: int,
    gender: str,
    additional_notes: str | None = None,
) -> SymptomCheckResponse:
    """Analyse a list of symptoms and return specialty recommendations + urgency.

    The urgency score is computed as the *maximum* individual symptom weight
    plus modifiers for age group and for symptom count (combinatorial risk).
    Specialty confidence is proportional to how many of the supplied symptoms
    map to each specialty.
    """

    matched: list[str] = []
    unrecognized: list[str] = []
    specialty_counter: Counter[str] = Counter()
    urgency_weights: list[float] = []

    for symptom in symptoms:
        key = symptom.lower().strip().replace(" ", "_")
        entry = SYMPTOM_SPECIALTY_MAP.get(key)
        if entry is None:
            unrecognized.append(symptom)
            continue
        matched.append(key)
        urgency_weights.append(entry["urgency_weight"])
        for spec in entry["specialties"]:
            specialty_counter[spec] += 1

    # -- Urgency calculation ------------------------------------------------
    if not urgency_weights:
        base_urgency = 0.1
    else:
        base_urgency = max(urgency_weights)

    # Age modifier
    age_mod = AGE_URGENCY_MODIFIER.get(_age_group(age), 0.0)

    # Multi-symptom modifier: each additional symptom beyond 1 adds 0.03
    multi_mod = min(0.15, max(0, (len(matched) - 1)) * 0.03)

    urgency_score = min(1.0, base_urgency + age_mod + multi_mod)
    urgency_level = _classify_urgency(urgency_score)

    # -- Specialty ranking --------------------------------------------------
    total_matches = sum(specialty_counter.values()) or 1
    specialty_recs: list[SpecialtyRecommendation] = []
    for spec, count in specialty_counter.most_common(5):
        confidence = round(count / total_matches, 2)
        desc = SPECIALTY_DESCRIPTIONS.get(spec, "Medical specialty.")
        specialty_recs.append(
            SpecialtyRecommendation(specialty=spec, confidence=confidence, description=desc)
        )

    # Fallback when nothing matched
    if not specialty_recs:
        specialty_recs.append(
            SpecialtyRecommendation(
                specialty="General Medicine",
                confidence=0.5,
                description=SPECIALTY_DESCRIPTIONS["General Medicine"],
            )
        )

    actions = URGENCY_ACTIONS.get(urgency_level.value, URGENCY_ACTIONS["LOW"])

    return SymptomCheckResponse(
        urgency_level=urgency_level,
        urgency_score=round(urgency_score, 3),
        recommended_specialties=specialty_recs,
        suggested_actions=actions,
        matched_symptoms=matched,
        unrecognized_symptoms=unrecognized,
    )
