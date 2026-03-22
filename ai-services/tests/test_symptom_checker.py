"""Unit tests for the symptom checker engine."""

import pytest
from src.ml.symptom_engine import check_symptoms
from src.models.schemas import UrgencyLevel


class TestSymptomEngine:
    """Tests for check_symptoms()."""

    def test_single_low_urgency_symptom(self):
        result = check_symptoms(["cough"], age=30, gender="male")
        assert result.urgency_level == UrgencyLevel.LOW
        assert len(result.matched_symptoms) == 1
        assert "cough" in result.matched_symptoms
        assert len(result.recommended_specialties) > 0

    def test_emergency_symptoms(self):
        result = check_symptoms(
            ["chest_pain", "shortness_of_breath", "dizziness"],
            age=55,
            gender="male",
        )
        assert result.urgency_level in (UrgencyLevel.HIGH, UrgencyLevel.EMERGENCY)
        assert result.urgency_score >= 0.8
        specialties = [s.specialty for s in result.recommended_specialties]
        assert any(
            s in specialties
            for s in ["Cardiology", "Emergency Medicine", "Pulmonology"]
        )

    def test_child_age_modifier(self):
        # Same symptom but for a child should have higher urgency
        adult = check_symptoms(["fever"], age=30, gender="female")
        child = check_symptoms(["fever"], age=5, gender="female")
        assert child.urgency_score > adult.urgency_score

    def test_elderly_age_modifier(self):
        adult = check_symptoms(["headache"], age=35, gender="male")
        elderly = check_symptoms(["headache"], age=75, gender="male")
        assert elderly.urgency_score > adult.urgency_score

    def test_unrecognized_symptoms(self):
        result = check_symptoms(
            ["cough", "made_up_symptom", "another_fake"],
            age=25,
            gender="other",
        )
        assert "cough" in result.matched_symptoms
        assert "made_up_symptom" in result.unrecognized_symptoms
        assert "another_fake" in result.unrecognized_symptoms

    def test_all_unrecognized_returns_general_medicine(self):
        result = check_symptoms(["xyz_unknown"], age=40, gender="female")
        assert len(result.unrecognized_symptoms) == 1
        specialties = [s.specialty for s in result.recommended_specialties]
        assert "General Medicine" in specialties

    def test_multiple_symptoms_increase_urgency(self):
        single = check_symptoms(["headache"], age=40, gender="male")
        multi = check_symptoms(
            ["headache", "dizziness", "nausea", "fatigue"],
            age=40,
            gender="male",
        )
        assert multi.urgency_score >= single.urgency_score

    def test_seizure_is_emergency(self):
        result = check_symptoms(["seizure"], age=30, gender="male")
        assert result.urgency_level == UrgencyLevel.EMERGENCY
        specialties = [s.specialty for s in result.recommended_specialties]
        assert "Neurology" in specialties or "Emergency Medicine" in specialties

    def test_suggested_actions_present(self):
        result = check_symptoms(["rash"], age=25, gender="female")
        assert len(result.suggested_actions) > 0

    def test_disclaimer_present(self):
        result = check_symptoms(["cough"], age=30, gender="male")
        assert "DISCLAIMER" in result.disclaimer

    def test_specialty_confidence_sums_reasonable(self):
        result = check_symptoms(
            ["chest_pain", "shortness_of_breath"],
            age=50,
            gender="male",
        )
        total_conf = sum(s.confidence for s in result.recommended_specialties)
        # Confidences are relative, total should be > 0 and <= number of specialties
        assert total_conf > 0

    def test_cardiac_symptoms_recommend_cardiology(self):
        result = check_symptoms(
            ["chest_pain", "heart_palpitations", "irregular_heartbeat"],
            age=60,
            gender="male",
        )
        top_specialty = result.recommended_specialties[0].specialty
        assert top_specialty == "Cardiology"

    def test_gi_symptoms_recommend_gastroenterology(self):
        result = check_symptoms(
            ["abdominal_pain", "nausea", "vomiting", "diarrhea"],
            age=35,
            gender="female",
        )
        specialties = [s.specialty for s in result.recommended_specialties]
        assert "Gastroenterology" in specialties

    def test_severe_allergic_reaction_is_max_emergency(self):
        result = check_symptoms(["severe_allergic_reaction"], age=28, gender="male")
        assert result.urgency_level == UrgencyLevel.EMERGENCY
        assert result.urgency_score >= 0.95

    def test_case_insensitivity(self):
        result = check_symptoms(["Chest_Pain", "COUGH"], age=40, gender="male")
        assert len(result.matched_symptoms) == 2

    def test_whitespace_handling(self):
        result = check_symptoms(["  fever  ", "cough "], age=30, gender="female")
        assert len(result.matched_symptoms) == 2
