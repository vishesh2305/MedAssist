"""Unit tests for the cost prediction model."""

import pytest
import numpy as np
from src.ml.cost_model import generate_synthetic_data, train_cost_model, CostPredictor


class TestSyntheticData:
    """Tests for synthetic data generation."""

    def test_generates_dataframe(self):
        df = generate_synthetic_data(n_samples_per_combo=2)
        assert len(df) > 0
        assert set(df.columns) == {"procedure", "region", "tier", "category", "cost"}

    def test_all_costs_positive(self):
        df = generate_synthetic_data(n_samples_per_combo=3)
        assert (df["cost"] > 0).all()

    def test_tier_multiplier_affects_cost(self):
        df = generate_synthetic_data(n_samples_per_combo=20, seed=123)
        # For the same procedure+region, luxury should cost more than basic on average
        for proc in ["mri_scan", "general_consultation"]:
            subset = df[df["procedure"] == proc]
            if len(subset) == 0:
                continue
            basic_avg = subset[subset["tier"] == "basic"]["cost"].mean()
            luxury_avg = subset[subset["tier"] == "luxury"]["cost"].mean()
            assert luxury_avg > basic_avg, f"{proc}: luxury ({luxury_avg}) should > basic ({basic_avg})"

    def test_different_seeds_produce_different_data(self):
        df1 = generate_synthetic_data(n_samples_per_combo=2, seed=1)
        df2 = generate_synthetic_data(n_samples_per_combo=2, seed=2)
        assert not np.allclose(df1["cost"].values, df2["cost"].values)


class TestModelTraining:
    """Tests for model training."""

    def test_train_returns_metrics(self):
        result = train_cost_model()
        assert "r2_score" in result
        assert "n_samples" in result
        assert result["r2_score"] > 0.5  # should fit reasonably well


class TestCostPredictor:
    """Tests for the CostPredictor class."""

    @pytest.fixture(autouse=True)
    def setup(self):
        train_cost_model()
        self.predictor = CostPredictor()

    def test_known_procedure_known_city(self):
        result = self.predictor.predict("mri_scan", "Bangkok", "standard")
        assert result["region"] == "Southeast Asia"
        assert result["estimated_cost_min"] > 0
        assert result["estimated_cost_max"] > result["estimated_cost_min"]
        assert result["confidence"] >= 0.5

    def test_premium_costs_more_than_basic(self):
        basic = self.predictor.predict("general_consultation", "London", "basic")
        premium = self.predictor.predict("general_consultation", "London", "premium")
        assert premium["estimated_cost_avg"] > basic["estimated_cost_avg"]

    def test_north_america_more_expensive_than_south_asia(self):
        us = self.predictor.predict("mri_scan", "New York", "standard")
        india = self.predictor.predict("mri_scan", "Mumbai", "standard")
        assert us["estimated_cost_avg"] > india["estimated_cost_avg"]

    def test_unknown_city_returns_result(self):
        result = self.predictor.predict("blood_test", "UnknownCity", "standard")
        assert result["estimated_cost_avg"] > 0
        assert result["city"] == "UnknownCity"

    def test_unknown_procedure_returns_low_confidence(self):
        result = self.predictor.predict("unknown_procedure", "Tokyo", "standard")
        assert result["confidence"] <= 0.5

    def test_all_tiers_produce_results(self):
        for tier in ["basic", "standard", "premium", "luxury"]:
            result = self.predictor.predict("appendectomy", "Dubai", tier)
            assert result["estimated_cost_avg"] > 0
            assert result["hospital_tier"] == tier

    def test_surgery_more_expensive_than_consultation(self):
        consult = self.predictor.predict("general_consultation", "Tokyo", "standard")
        surgery = self.predictor.predict("knee_replacement", "Tokyo", "standard")
        assert surgery["estimated_cost_avg"] > consult["estimated_cost_avg"]
