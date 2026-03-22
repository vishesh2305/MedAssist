"""Cost prediction model - trains on synthetic data, predicts procedure costs."""

from __future__ import annotations

import os
import json
import logging
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

from src.utils.medical_data import (
    PROCEDURES,
    CITY_REGION_MAP,
    HOSPITAL_TIER_MULTIPLIER,
)

logger = logging.getLogger(__name__)

MODEL_DIR = Path(os.getenv("MODEL_PATH", "trained_models"))
MODEL_FILE = MODEL_DIR / "cost_model.joblib"
ENCODERS_FILE = MODEL_DIR / "cost_encoders.joblib"

# ---------------------------------------------------------------------------
# Synthetic data generation
# ---------------------------------------------------------------------------

def generate_synthetic_data(n_samples_per_combo: int = 5, seed: int = 42) -> pd.DataFrame:
    """Generate realistic synthetic training data from the procedure cost tables.

    For every (procedure, region, tier) combination we create *n_samples_per_combo*
    rows with costs sampled uniformly between the min and max for that combo,
    multiplied by the tier multiplier, with a small random noise term.
    """
    rng = np.random.RandomState(seed)
    rows: list[dict] = []

    regions = sorted({r for p in PROCEDURES.values() for r in p["costs_by_region"]})
    tiers = list(HOSPITAL_TIER_MULTIPLIER.keys())

    for proc_key, proc_data in PROCEDURES.items():
        for region in regions:
            cost_range = proc_data["costs_by_region"].get(region)
            if cost_range is None:
                continue
            for tier in tiers:
                mult = HOSPITAL_TIER_MULTIPLIER[tier]
                for _ in range(n_samples_per_combo):
                    base = rng.uniform(cost_range["min"], cost_range["max"])
                    noise = rng.normal(1.0, 0.05)  # +/- 5 % noise
                    cost = max(1.0, base * mult * noise)
                    rows.append({
                        "procedure": proc_key,
                        "region": region,
                        "tier": tier,
                        "category": proc_data["category"],
                        "cost": round(cost, 2),
                    })

    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def train_cost_model() -> dict:
    """Train a GradientBoosting regressor on synthetic data and persist to disk."""
    logger.info("Generating synthetic training data ...")
    df = generate_synthetic_data(n_samples_per_combo=8)
    logger.info(f"Training data shape: {df.shape}")

    # Encode categorical features
    le_proc = LabelEncoder().fit(df["procedure"])
    le_region = LabelEncoder().fit(df["region"])
    le_tier = LabelEncoder().fit(df["tier"])
    le_cat = LabelEncoder().fit(df["category"])

    X = pd.DataFrame({
        "procedure_enc": le_proc.transform(df["procedure"]),
        "region_enc": le_region.transform(df["region"]),
        "tier_enc": le_tier.transform(df["tier"]),
        "category_enc": le_cat.transform(df["category"]),
    })
    y = df["cost"].values

    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
    )
    model.fit(X, y)

    # Persist
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_FILE)
    joblib.dump({
        "procedure": le_proc,
        "region": le_region,
        "tier": le_tier,
        "category": le_cat,
    }, ENCODERS_FILE)

    score = model.score(X, y)
    logger.info(f"Model R^2 on training data: {score:.4f}")
    return {"r2_score": round(score, 4), "n_samples": len(df)}


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------

class CostPredictor:
    """Loads the trained model and provides cost predictions."""

    def __init__(self) -> None:
        self.model = None
        self.encoders: dict = {}
        self._load()

    def _load(self) -> None:
        if MODEL_FILE.exists() and ENCODERS_FILE.exists():
            self.model = joblib.load(MODEL_FILE)
            self.encoders = joblib.load(ENCODERS_FILE)
            logger.info("Cost model loaded successfully.")
        else:
            logger.warning("Trained model not found - predictions will use table lookup fallback.")

    def predict(
        self,
        procedure_type: str,
        city: str,
        hospital_tier: str,
    ) -> dict:
        """Return cost prediction dict."""
        city_lower = city.lower().strip()
        region = CITY_REGION_MAP.get(city_lower, "Southeast Asia")  # default region
        proc_key = procedure_type.lower().strip().replace(" ", "_")

        # Determine procedure category
        proc_info = PROCEDURES.get(proc_key)
        category = proc_info["category"] if proc_info else "consultation"

        tier = hospital_tier.lower().strip()
        tier_mult = HOSPITAL_TIER_MULTIPLIER.get(tier, 1.0)

        # Try ML model first
        if self.model is not None:
            try:
                proc_enc = self.encoders["procedure"].transform([proc_key])[0]
                region_enc = self.encoders["region"].transform([region])[0]
                tier_enc = self.encoders["tier"].transform([tier])[0]
                cat_enc = self.encoders["category"].transform([category])[0]

                X = np.array([[proc_enc, region_enc, tier_enc, cat_enc]])
                predicted = float(self.model.predict(X)[0])
                predicted = max(1.0, predicted)

                # Confidence based on whether we have an exact procedure match
                confidence = 0.85 if proc_info else 0.5

                return {
                    "procedure": proc_info["name"] if proc_info else procedure_type,
                    "city": city,
                    "region": region,
                    "hospital_tier": tier,
                    "estimated_cost_min": round(predicted * 0.8, 2),
                    "estimated_cost_max": round(predicted * 1.2, 2),
                    "estimated_cost_avg": round(predicted, 2),
                    "confidence": confidence,
                    "currency": "USD",
                    "note": "Prediction from ML model trained on regional cost data.",
                }
            except (ValueError, KeyError):
                pass  # fall through to table lookup

        # Fallback: table lookup
        if proc_info and region in proc_info["costs_by_region"]:
            cr = proc_info["costs_by_region"][region]
            min_c = cr["min"] * tier_mult
            max_c = cr["max"] * tier_mult
            avg_c = (min_c + max_c) / 2
            return {
                "procedure": proc_info["name"],
                "city": city,
                "region": region,
                "hospital_tier": tier,
                "estimated_cost_min": round(min_c, 2),
                "estimated_cost_max": round(max_c, 2),
                "estimated_cost_avg": round(avg_c, 2),
                "confidence": 0.7,
                "currency": "USD",
                "note": "Estimate based on regional cost tables (model fallback).",
            }

        # Last resort
        return {
            "procedure": procedure_type,
            "city": city,
            "region": region,
            "hospital_tier": tier,
            "estimated_cost_min": 50.0,
            "estimated_cost_max": 500.0,
            "estimated_cost_avg": 275.0,
            "confidence": 0.3,
            "currency": "USD",
            "note": "Low-confidence estimate. Procedure or region not in our database.",
        }
