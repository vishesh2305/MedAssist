"""Unit tests for the hospital ranking engine."""

import pytest
from src.models.schemas import Location, UserPreferences, HospitalInput
from src.ml.ranking_engine import rank_hospitals, _haversine


def _make_hospital(**overrides) -> HospitalInput:
    defaults = {
        "id": "h1",
        "name": "Test Hospital",
        "latitude": 13.76,
        "longitude": 100.50,
        "rating": 4.0,
        "specialties": ["General Medicine"],
        "languages_spoken": ["english", "thai"],
        "avg_cost_level": 0.5,
        "has_emergency": True,
        "accreditations": [],
        "average_wait_minutes": 30,
    }
    defaults.update(overrides)
    return HospitalInput(**defaults)


class TestHaversine:
    def test_same_point_zero_distance(self):
        assert _haversine(0, 0, 0, 0) == 0.0

    def test_known_distance(self):
        # London to Paris ~ 344 km
        dist = _haversine(51.5074, -0.1278, 48.8566, 2.3522)
        assert 340 < dist < 350

    def test_symmetric(self):
        d1 = _haversine(10, 20, 30, 40)
        d2 = _haversine(30, 40, 10, 20)
        assert abs(d1 - d2) < 0.01


class TestHospitalRanking:
    def test_closer_hospital_ranks_higher(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        near = _make_hospital(id="near", name="Near Hospital", latitude=13.77, longitude=100.51)
        far = _make_hospital(id="far", name="Far Hospital", latitude=14.50, longitude=101.50)

        result = rank_hospitals(user_loc, UserPreferences(), [near, far])
        assert result.ranked_hospitals[0].id == "near"

    def test_higher_rated_preferred(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        # Same distance, different ratings
        low = _make_hospital(id="low", name="Low Rated", latitude=13.77, longitude=100.51, rating=2.0)
        high = _make_hospital(id="high", name="High Rated", latitude=13.77, longitude=100.51, rating=5.0)

        result = rank_hospitals(user_loc, UserPreferences(), [low, high])
        assert result.ranked_hospitals[0].id == "high"

    def test_language_preference_boosts_rank(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(preferred_language="japanese")
        jp = _make_hospital(
            id="jp", name="JP Hospital",
            latitude=13.77, longitude=100.51,
            languages_spoken=["japanese", "english"],
            rating=3.5,
        )
        en = _make_hospital(
            id="en", name="EN Hospital",
            latitude=13.77, longitude=100.51,
            languages_spoken=["english"],
            rating=3.5,
        )
        result = rank_hospitals(user_loc, prefs, [en, jp])
        assert result.ranked_hospitals[0].id == "jp"

    def test_specialty_match_boosts_rank(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(required_specialty="Cardiology")
        cardio = _make_hospital(
            id="cardio", name="Cardio Hospital",
            latitude=13.77, longitude=100.51,
            specialties=["Cardiology", "General Medicine"],
            rating=3.5,
        )
        general = _make_hospital(
            id="gen", name="General Hospital",
            latitude=13.77, longitude=100.51,
            specialties=["General Medicine"],
            rating=3.5,
        )
        result = rank_hospitals(user_loc, prefs, [general, cardio])
        assert result.ranked_hospitals[0].id == "cardio"

    def test_emergency_filter(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(emergency_only=True)
        er = _make_hospital(id="er", name="ER Hospital", has_emergency=True, latitude=13.77, longitude=100.51)
        no_er = _make_hospital(id="no_er", name="Clinic", has_emergency=False, latitude=13.77, longitude=100.51)

        result = rank_hospitals(user_loc, prefs, [no_er, er])
        assert result.total_hospitals == 1
        assert result.ranked_hospitals[0].id == "er"

    def test_min_rating_filter(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(min_rating=4.0)
        low = _make_hospital(id="low", name="Low", rating=3.0, latitude=13.77, longitude=100.51)
        high = _make_hospital(id="high", name="High", rating=4.5, latitude=13.77, longitude=100.51)

        result = rank_hospitals(user_loc, prefs, [low, high])
        assert result.total_hospitals == 1
        assert result.ranked_hospitals[0].id == "high"

    def test_budget_preference_penalizes_expensive(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(max_budget=0.3)
        cheap = _make_hospital(
            id="cheap", name="Cheap", avg_cost_level=0.2,
            latitude=13.77, longitude=100.51, rating=4.0,
        )
        expensive = _make_hospital(
            id="exp", name="Expensive", avg_cost_level=0.9,
            latitude=13.77, longitude=100.51, rating=4.0,
        )
        result = rank_hospitals(user_loc, prefs, [expensive, cheap])
        assert result.ranked_hospitals[0].id == "cheap"

    def test_scores_between_zero_and_one(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        h = _make_hospital(latitude=13.77, longitude=100.51)
        result = rank_hospitals(user_loc, UserPreferences(), [h])
        ranked = result.ranked_hospitals[0]
        assert 0 <= ranked.overall_score <= 1
        assert 0 <= ranked.distance_score <= 1
        assert 0 <= ranked.rating_score <= 1

    def test_ranks_assigned_correctly(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        hospitals = [
            _make_hospital(id=f"h{i}", name=f"Hospital {i}", latitude=13.77 + i * 0.1, longitude=100.51, rating=4.0 - i * 0.5)
            for i in range(5)
        ]
        result = rank_hospitals(user_loc, UserPreferences(), hospitals)
        ranks = [h.rank for h in result.ranked_hospitals]
        assert ranks == list(range(1, len(ranks) + 1))

    def test_filters_applied_in_response(self):
        user_loc = Location(latitude=13.76, longitude=100.50)
        prefs = UserPreferences(
            preferred_language="english",
            required_specialty="Cardiology",
            min_rating=3.0,
        )
        h = _make_hospital(latitude=13.77, longitude=100.51, specialties=["Cardiology"])
        result = rank_hospitals(user_loc, prefs, [h])
        assert "preferred_language" in result.filters_applied
        assert "required_specialty" in result.filters_applied
        assert "min_rating" in result.filters_applied
