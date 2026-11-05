"""Quantifier service.

Returns scores only. This module must never select an employee,
form a team, or override an allocation constraint.
"""

import os
import joblib
import pandas as pd

from services.model_registry import MODEL_VERSION

_MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")

performance_model = joblib.load(os.path.join(_MODEL_DIR, "performance_model.pkl"))
completion_model = joblib.load(os.path.join(_MODEL_DIR, "completion_model.pkl"))
burnout_model = joblib.load(os.path.join(_MODEL_DIR, "burnout_model.pkl"))

# MUST match train.py feature order exactly. Changing this list without
# retraining silently corrupts every prediction.
FEATURE_ORDER = [
    "skill_match_score",
    "workload_ratio",
    "task_complexity",
    "estimated_hours",
    "efficiency_score",
    "consistency_score",
    "reliability_score",
    "availability_score",
    "project_priority",
]

_expected = getattr(performance_model, "n_features_in_", len(FEATURE_ORDER))
assert _expected == len(FEATURE_ORDER), (
    f"Feature contract drift: model expects {_expected} features, "
    f"FEATURE_ORDER declares {len(FEATURE_ORDER)}. Retrain or fix FEATURE_ORDER."
)


def _build_dataframe(features: dict) -> pd.DataFrame:
    missing = [name for name in FEATURE_ORDER if name not in features]
    if missing:
        raise ValueError(f"Missing required features: {missing}")
    return pd.DataFrame(
        [[float(features[name]) for name in FEATURE_ORDER]],
        columns=FEATURE_ORDER,
    )


def predict(features: dict) -> dict:
    X = _build_dataframe(features)

    performance = float(performance_model.predict(X)[0])

    # predict_proba, not predict: a classifier's .predict() returns a
    # 0/1 label, which would make risk_score binary.
    burnout = float(burnout_model.predict_proba(X)[0][1])

    # completion_model is a regressor over actual_hours, NOT a probability.
    # Convert to an on-time likelihood by comparing estimated hours to predicted hours;
    # ratios >= 1 mean "expected to finish within estimate".
    predicted_hours = float(completion_model.predict(X)[0])
    estimated_hours = float(features["estimated_hours"])
    if estimated_hours > 0 and predicted_hours > 0:
        ratio = estimated_hours / predicted_hours
    else:
        ratio = 0.5
    completion_probability = max(0.0, min(1.0, ratio)) * (1.0 - burnout)

    confidence = max(0.5, min(0.98, 0.6 + performance * 0.25 + (1.0 - burnout) * 0.15))

    return {
        "predicted_performance": round(performance, 6),
        "risk_score": round(burnout, 6),
        "completion_probability": round(completion_probability, 6),
        "confidence": round(confidence, 6),
        "model_version": MODEL_VERSION,
    }