import csv
import os

_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(_BASE_DIR, "datasets")
DATASET_PATH = os.path.join(DATASET_DIR, "training_data.csv")

FIELDNAMES = [
    "skill_match_score",
    "workload_ratio",
    "task_complexity",
    "estimated_hours",
    "efficiency_score",
    "consistency_score",
    "reliability_score",
    "availability_score",
    "project_priority",
    "actual_performance_score",
    "actual_hours",
    "burnout_high_risk",
]


def append_training_record(data: dict):
    os.makedirs(DATASET_DIR, exist_ok=True)
    file_exists = os.path.exists(DATASET_PATH)

    with open(DATASET_PATH, mode="a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)