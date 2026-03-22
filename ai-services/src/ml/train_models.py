"""Script to train and save all ML models.

Run with:  python -m src.ml.train_models
"""

import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("=== MedAssist Global - Model Training ===")

    # 1. Train cost prediction model
    logger.info("Training cost prediction model ...")
    from src.ml.cost_model import train_cost_model
    result = train_cost_model()
    logger.info(f"Cost model trained: {result}")

    logger.info("=== All models trained successfully ===")


if __name__ == "__main__":
    main()
