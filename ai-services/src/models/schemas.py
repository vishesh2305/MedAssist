"""Pydantic request / response models for all AI service endpoints."""

from __future__ import annotations

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class UrgencyLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    EMERGENCY = "EMERGENCY"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class HospitalTier(str, Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"
    LUXURY = "luxury"


# ---------------------------------------------------------------------------
# Symptom Checker
# ---------------------------------------------------------------------------

class SymptomCheckRequest(BaseModel):
    symptoms: list[str] = Field(..., min_length=1, description="List of symptom identifiers")
    age: int = Field(..., ge=0, le=150, description="Patient age in years")
    gender: Gender = Field(..., description="Patient gender")
    additional_notes: Optional[str] = Field(None, description="Free-text notes from the patient")

    model_config = {"json_schema_extra": {
        "example": {
            "symptoms": ["chest_pain", "shortness_of_breath", "dizziness"],
            "age": 55,
            "gender": "male",
            "additional_notes": "Started 2 hours ago after climbing stairs",
        }
    }}


class SpecialtyRecommendation(BaseModel):
    specialty: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    description: str


class SymptomCheckResponse(BaseModel):
    urgency_level: UrgencyLevel
    urgency_score: float
    recommended_specialties: list[SpecialtyRecommendation]
    suggested_actions: list[str]
    matched_symptoms: list[str]
    unrecognized_symptoms: list[str]
    disclaimer: str = (
        "DISCLAIMER: This is an AI-powered preliminary assessment and NOT a medical diagnosis. "
        "Always consult a qualified healthcare professional for proper medical advice. "
        "If you are experiencing a medical emergency, please call your local emergency number immediately."
    )


# ---------------------------------------------------------------------------
# Translation & Chat
# ---------------------------------------------------------------------------

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_language: str = Field(..., description="Source language")
    target_language: str = Field(..., description="Target language")

    model_config = {"json_schema_extra": {
        "example": {
            "text": "I need a doctor",
            "source_language": "english",
            "target_language": "spanish",
        }
    }}


class TranslationResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    method: str = Field(..., description="Translation method used: 'openai' or 'dictionary_fallback'")
    confidence: float = Field(..., ge=0.0, le=1.0)


class ChatAssistRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_history: list[dict] = Field(default_factory=list)
    language: str = Field(default="english")

    model_config = {"json_schema_extra": {
        "example": {
            "message": "What should I do if I have a high fever while traveling?",
            "conversation_history": [],
            "language": "english",
        }
    }}


class ChatAssistResponse(BaseModel):
    reply: str
    suggestions: list[str] = Field(default_factory=list)
    disclaimer: str = (
        "DISCLAIMER: This AI assistant provides general health information only. "
        "It is NOT a substitute for professional medical advice, diagnosis, or treatment."
    )


# ---------------------------------------------------------------------------
# Cost Prediction
# ---------------------------------------------------------------------------

class CostPredictionRequest(BaseModel):
    procedure_type: str = Field(..., description="Procedure identifier")
    city: str = Field(..., description="City where the procedure will be performed")
    hospital_tier: HospitalTier = Field(default=HospitalTier.STANDARD)

    model_config = {"json_schema_extra": {
        "example": {
            "procedure_type": "mri_scan",
            "city": "Bangkok",
            "hospital_tier": "standard",
        }
    }}


class CostPredictionResponse(BaseModel):
    procedure: str
    city: str
    region: str
    hospital_tier: str
    estimated_cost_min: float
    estimated_cost_max: float
    estimated_cost_avg: float
    confidence: float = Field(..., ge=0.0, le=1.0)
    currency: str = "USD"
    note: str = ""


# ---------------------------------------------------------------------------
# Hospital Ranking
# ---------------------------------------------------------------------------

class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class UserPreferences(BaseModel):
    preferred_language: Optional[str] = None
    required_specialty: Optional[str] = None
    max_budget: Optional[float] = None
    emergency_only: bool = False
    min_rating: Optional[float] = Field(None, ge=0.0, le=5.0)


class HospitalInput(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    rating: float = Field(..., ge=0.0, le=5.0)
    specialties: list[str] = Field(default_factory=list)
    languages_spoken: list[str] = Field(default_factory=list)
    avg_cost_level: float = Field(..., ge=0.0, le=1.0, description="0=cheapest, 1=most expensive")
    has_emergency: bool = False
    accreditations: list[str] = Field(default_factory=list)
    average_wait_minutes: Optional[int] = None

    model_config = {"json_schema_extra": {
        "example": {
            "id": "hosp_001",
            "name": "Bangkok International Hospital",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "rating": 4.5,
            "specialties": ["Cardiology", "Orthopedics", "General Medicine"],
            "languages_spoken": ["thai", "english", "chinese"],
            "avg_cost_level": 0.6,
            "has_emergency": True,
            "accreditations": ["JCI"],
            "average_wait_minutes": 20,
        }
    }}


class RankHospitalsRequest(BaseModel):
    user_location: Location
    user_preferences: UserPreferences = Field(default_factory=UserPreferences)
    hospitals: list[HospitalInput] = Field(..., min_length=1)

    model_config = {"json_schema_extra": {
        "example": {
            "user_location": {"latitude": 13.7563, "longitude": 100.5018},
            "user_preferences": {
                "preferred_language": "english",
                "required_specialty": "Cardiology",
                "max_budget": 0.7,
            },
            "hospitals": [],
        }
    }}


class RankedHospital(BaseModel):
    id: str
    name: str
    overall_score: float = Field(..., ge=0.0, le=1.0)
    distance_km: float
    distance_score: float
    rating_score: float
    price_score: float
    language_score: float
    specialty_score: float
    emergency_score: float
    rank: int


class RankHospitalsResponse(BaseModel):
    ranked_hospitals: list[RankedHospital]
    total_hospitals: int
    filters_applied: dict
