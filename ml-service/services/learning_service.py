from utils.dataset_writer import append_training_record


def learn(payload: dict) -> dict:
    """Append a realised outcome as a training row.

    Column names and order MUST match train.py's feature list plus
    its three targets, ensuring training data integrity.
    """
    row = {
        # 9 Features
        "skill_match_score": float(payload["skill_match_score"]),
        "workload_ratio": float(payload["workload_ratio"]),
        "task_complexity": float(payload["task_complexity"]),
        "estimated_hours": float(payload["estimated_hours"]),
        "efficiency_score": float(payload["efficiency_score"]),
        "consistency_score": float(payload["consistency_score"]),
        "reliability_score": float(payload["reliability_score"]),
        "availability_score": float(payload["availability_score"]),
        "project_priority": float(payload["project_priority"]),
        # 3 Targets
        "actual_performance_score": float(payload["actual_performance_score"]),
        "actual_hours": float(payload["actual_hours"]),
        "burnout_high_risk": int(payload["burnout_high_risk"]),
    }

    append_training_record(row)

    return {
        "success": True,
        "status": "recorded",
        "columns": len(row),
        "message": "Realised outcome successfully recorded for retraining.",
    }