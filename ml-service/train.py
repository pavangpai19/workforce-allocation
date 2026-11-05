"""
Workforce Allocation ML Training and Evaluation Pipeline
Synthetic Dataset: historical_outcomes.csv (synthetic_dataset_option_a_v2)
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import (
    GradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split


def main():
    # ---------------------------------------------------------
    # 1. LOAD AND INSPECT DATA
    # ---------------------------------------------------------
    data_path = os.path.join("datasets", "historical_outcomes.csv")
    print("=" * 70)
    print("1. LOADING AND INSPECTING DATA")
    print("=" * 70)
    df = pd.read_csv(data_path)
    print(f"Dataset Loaded Successfully from: {data_path}")
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Row count confirmation: {'Confirmed 1,000 rows' if len(df) == 1000 else f'Found {len(df)} rows'}")

    print("\n--- First 5 Rows ---")
    print(df.head())

    print("\n--- Column Names & Data Types ---")
    print(df.dtypes)

    print("\n--- Non-Null Counts & Info ---")
    df.info()

    print("\n--- Burnout Distribution (burnout_high_risk) ---")
    counts = df["burnout_high_risk"].value_counts()
    props = df["burnout_high_risk"].value_counts(normalize=True) * 100
    for val in sorted(counts.index):
        print(f"  Class {val}: {counts[val]} rows ({props[val]:.2f}%)")

    # ---------------------------------------------------------
    # 2. DEFINE FEATURES AND TARGETS
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("2. DEFINING FEATURES AND TARGETS")
    print("=" * 70)
    features = [
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

    X = df[features]
    y_performance = df["actual_performance_score"]
    y_completion = df["actual_hours"]
    y_burnout = df["burnout_high_risk"]

    print(f"Features (X) ({len(features)}): {features}")
    print(f"Target 1 (Performance Regression): actual_performance_score (mean={y_performance.mean():.4f}, std={y_performance.std():.4f})")
    print(f"Target 2 (Completion Regression): actual_hours (mean={y_completion.mean():.4f}, std={y_completion.std():.4f})")
    print(f"Target 3 (Burnout Classification): burnout_high_risk (counts={y_burnout.value_counts().to_dict()})")

    # ---------------------------------------------------------
    # 3. TRAIN/TEST SPLIT
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("3. TRAIN / TEST SPLIT (80/20, random_state=42)")
    print("=" * 70)
    X_train, X_test, y_perf_train, y_perf_test = train_test_split(
        X, y_performance, test_size=0.20, random_state=42
    )
    _, _, y_comp_train, y_comp_test = train_test_split(
        X, y_completion, test_size=0.20, random_state=42
    )
    _, _, y_burn_train, y_burn_test = train_test_split(
        X, y_burnout, test_size=0.20, random_state=42
    )

    print(f"Training Set Size: {X_train.shape[0]} samples")
    print(f"Testing Set Size:  {X_test.shape[0]} samples")
    print(f"Test Burnout Distribution: {y_burn_test.value_counts().to_dict()}")

    # ---------------------------------------------------------
    # 4. & 5. TRAIN & EVALUATE MODELS
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("4. & 5. TRAINING AND EVALUATING MODELS")
    print("=" * 70)

    # a) Performance Model: RandomForestRegressor
    perf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    perf_model.fit(X_train, y_perf_train)
    y_perf_pred = perf_model.predict(X_test)

    perf_mae = mean_absolute_error(y_perf_test, y_perf_pred)
    perf_rmse = np.sqrt(mean_squared_error(y_perf_test, y_perf_pred))
    perf_r2 = r2_score(y_perf_test, y_perf_pred)

    print(f"Performance Model - MAE: {perf_mae:.4f}, RMSE: {perf_rmse:.4f}, R²: {perf_r2:.4f}")

    # b) Completion Model: GradientBoostingRegressor
    comp_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    comp_model.fit(X_train, y_comp_train)
    y_comp_pred = comp_model.predict(X_test)

    comp_mae = mean_absolute_error(y_comp_test, y_comp_pred)
    comp_rmse = np.sqrt(mean_squared_error(y_comp_test, y_comp_pred))
    comp_r2 = r2_score(y_comp_test, y_comp_pred)

    print(f"Completion Model - MAE: {comp_mae:.4f}, RMSE: {comp_rmse:.4f}, R²: {comp_r2:.4f}")

    # c) Burnout Model: LogisticRegression (primary) & RandomForestClassifier
    burn_model_lr = LogisticRegression(max_iter=1000, random_state=42)
    burn_model_lr.fit(X_train, y_burn_train)
    y_burn_lr_pred = burn_model_lr.predict(X_test)
    y_burn_lr_proba = burn_model_lr.predict_proba(X_test)[:, 1]

    burn_lr_acc = accuracy_score(y_burn_test, y_burn_lr_pred)
    burn_lr_prec = precision_score(y_burn_test, y_burn_lr_pred)
    burn_lr_rec = recall_score(y_burn_test, y_burn_lr_pred)
    burn_lr_f1 = f1_score(y_burn_test, y_burn_lr_pred)
    burn_lr_auc = roc_auc_score(y_burn_test, y_burn_lr_proba)

    print(f"Burnout Model - Accuracy: {burn_lr_acc:.4f}, Precision: {burn_lr_prec:.4f}, Recall: {burn_lr_rec:.4f}, F1: {burn_lr_f1:.4f}, ROC-AUC: {burn_lr_auc:.4f}")

    # Burnout RandomForestClassifier for comparison and feature importances
    burn_model_rf = RandomForestClassifier(n_estimators=100, random_state=42)
    burn_model_rf.fit(X_train, y_burn_train)
    y_burn_rf_pred = burn_model_rf.predict(X_test)
    y_burn_rf_proba = burn_model_rf.predict_proba(X_test)[:, 1]

    burn_rf_acc = accuracy_score(y_burn_test, y_burn_rf_pred)
    burn_rf_prec = precision_score(y_burn_test, y_burn_rf_pred)
    burn_rf_rec = recall_score(y_burn_test, y_burn_rf_pred)
    burn_rf_f1 = f1_score(y_burn_test, y_burn_rf_pred)
    burn_rf_auc = roc_auc_score(y_burn_test, y_burn_rf_proba)

    print(f"Burnout Model (RandomForest) - Accuracy: {burn_rf_acc:.4f}, Precision: {burn_rf_prec:.4f}, Recall: {burn_rf_rec:.4f}, F1: {burn_rf_f1:.4f}, ROC-AUC: {burn_rf_auc:.4f}")

    # ---------------------------------------------------------
    # 6. SAVE MODELS
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("6. SAVING TRAINED MODELS")
    print("=" * 70)
    os.makedirs("models", exist_ok=True)

    joblib.dump(perf_model, os.path.join("models", "performance_model.pkl"))
    joblib.dump(comp_model, os.path.join("models", "completion_model.pkl"))
    joblib.dump(burn_model_lr, os.path.join("models", "burnout_model.pkl"))
    joblib.dump(burn_model_rf, os.path.join("models", "burnout_model_rf.pkl"))

    # Also save to current directory
    joblib.dump(perf_model, "performance_model.pkl")
    joblib.dump(comp_model, "completion_model.pkl")
    joblib.dump(burn_model_lr, "burnout_model.pkl")
    joblib.dump(burn_model_rf, "burnout_model_rf.pkl")

    print("Saved performance_model.pkl, completion_model.pkl, burnout_model.pkl")

    # ---------------------------------------------------------
    # 7. SAVE METRICS
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("7. SAVING EVALUATION METRICS")
    print("=" * 70)
    metrics = {
        "dataset": "historical_outcomes.csv (synthetic_dataset_option_a_v2)",
        "total_records": len(df),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "burnout_distribution": {
            "class_0_count": int(counts[0]),
            "class_0_percent": round(float(props[0]), 2),
            "class_1_count": int(counts[1]),
            "class_1_percent": round(float(props[1]), 2),
        },
        "features": features,
        "models": {
            "performance_model": {
                "algorithm": "RandomForestRegressor",
                "hyperparameters": {"n_estimators": 100, "random_state": 42},
                "target": "actual_performance_score",
                "metrics": {
                    "MAE": round(float(perf_mae), 4),
                    "RMSE": round(float(perf_rmse), 4),
                    "R2": round(float(perf_r2), 4),
                },
            },
            "completion_model": {
                "algorithm": "GradientBoostingRegressor",
                "hyperparameters": {"n_estimators": 100, "random_state": 42},
                "target": "actual_hours",
                "metrics": {
                    "MAE": round(float(comp_mae), 4),
                    "RMSE": round(float(comp_rmse), 4),
                    "R2": round(float(comp_r2), 4),
                },
            },
            "burnout_model_logistic_regression": {
                "algorithm": "LogisticRegression",
                "hyperparameters": {"max_iter": 1000, "random_state": 42},
                "target": "burnout_high_risk",
                "metrics": {
                    "Accuracy": round(float(burn_lr_acc), 4),
                    "Precision": round(float(burn_lr_prec), 4),
                    "Recall": round(float(burn_lr_rec), 4),
                    "F1_score": round(float(burn_lr_f1), 4),
                    "ROC_AUC": round(float(burn_lr_auc), 4),
                },
            },
            "burnout_model_random_forest": {
                "algorithm": "RandomForestClassifier",
                "hyperparameters": {"n_estimators": 100, "random_state": 42},
                "target": "burnout_high_risk",
                "metrics": {
                    "Accuracy": round(float(burn_rf_acc), 4),
                    "Precision": round(float(burn_rf_prec), 4),
                    "Recall": round(float(burn_rf_rec), 4),
                    "F1_score": round(float(burn_rf_f1), 4),
                    "ROC_AUC": round(float(burn_rf_auc), 4),
                },
            },
        },
    }

    with open("model_metrics.json", "w") as f:
        json.dump(metrics, f, indent=4)
    print("Saved metrics to model_metrics.json")

    # CSV Summary Table
    csv_data = [
        {
            "Model": "Performance Model",
            "Task_Type": "Regression",
            "Algorithm": "RandomForestRegressor",
            "Target": "actual_performance_score",
            "Metric_1": f"MAE: {perf_mae:.4f}",
            "Metric_2": f"RMSE: {perf_rmse:.4f}",
            "Metric_3": f"R²: {perf_r2:.4f}",
            "Metric_4": "-",
            "Metric_5": "-",
        },
        {
            "Model": "Completion Model",
            "Task_Type": "Regression",
            "Algorithm": "GradientBoostingRegressor",
            "Target": "actual_hours",
            "Metric_1": f"MAE: {comp_mae:.4f}",
            "Metric_2": f"RMSE: {comp_rmse:.4f}",
            "Metric_3": f"R²: {comp_r2:.4f}",
            "Metric_4": "-",
            "Metric_5": "-",
        },
        {
            "Model": "Burnout Model (Primary)",
            "Task_Type": "Classification",
            "Algorithm": "LogisticRegression",
            "Target": "burnout_high_risk",
            "Metric_1": f"Accuracy: {burn_lr_acc:.4f}",
            "Metric_2": f"Precision: {burn_lr_prec:.4f}",
            "Metric_3": f"Recall: {burn_lr_rec:.4f}",
            "Metric_4": f"F1: {burn_lr_f1:.4f}",
            "Metric_5": f"ROC-AUC: {burn_lr_auc:.4f}",
        },
        {
            "Model": "Burnout Model (Tree)",
            "Task_Type": "Classification",
            "Algorithm": "RandomForestClassifier",
            "Target": "burnout_high_risk",
            "Metric_1": f"Accuracy: {burn_rf_acc:.4f}",
            "Metric_2": f"Precision: {burn_rf_prec:.4f}",
            "Metric_3": f"Recall: {burn_rf_rec:.4f}",
            "Metric_4": f"F1: {burn_rf_f1:.4f}",
            "Metric_5": f"ROC-AUC: {burn_rf_auc:.4f}",
        },
    ]
    pd.DataFrame(csv_data).to_csv("model_metrics.csv", index=False)
    print("Saved metrics to model_metrics.csv")

    # ---------------------------------------------------------
    # 8. FEATURE IMPORTANCES
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print("8. FEATURE IMPORTANCE (TOP 5 FEATURES)")
    print("=" * 70)

    print("\n--- Performance Model (RandomForestRegressor) Top 5 Features ---")
    fi_perf = pd.Series(perf_model.feature_importances_, index=features).sort_values(ascending=False)
    for rank, (feat, imp) in enumerate(fi_perf.head(5).items(), 1):
        print(f"  {rank}. {feat}: {imp:.4f} ({imp*100:.2f}%)")

    print("\n--- Completion Model (GradientBoostingRegressor) Top 5 Features ---")
    fi_comp = pd.Series(comp_model.feature_importances_, index=features).sort_values(ascending=False)
    for rank, (feat, imp) in enumerate(fi_comp.head(5).items(), 1):
        print(f"  {rank}. {feat}: {imp:.4f} ({imp*100:.2f}%)")

    print("\n--- Burnout Model (RandomForestClassifier) Top 5 Features ---")
    fi_burn = pd.Series(burn_model_rf.feature_importances_, index=features).sort_values(ascending=False)
    for rank, (feat, imp) in enumerate(fi_burn.head(5).items(), 1):
        print(f"  {rank}. {feat}: {imp:.4f} ({imp*100:.2f}%)")


if __name__ == "__main__":
    main()