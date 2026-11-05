from fastapi import FastAPI
from pydantic import BaseModel

from services.prediction_service import predict
from services.learning_service import learn

app = FastAPI(
    title="Workforce ML Quantifier Service",
    description="Scores workforce allocation candidates without making allocation decisions.",
    version="1.0.0",
)


class ProfileInput(BaseModel):
    """Trained feature contract - must match train.py feature schema exactly."""
    skill_match_score: float
    workload_ratio: float
    task_complexity: float
    estimated_hours: float
    efficiency_score: float
    consistency_score: float
    reliability_score: float
    availability_score: float
    project_priority: float


class MLScorePackage(BaseModel):
    """The ONLY payload the quantifier is permitted to return.

    This service scores; it does not decide. No field here may
    identify a selected employee or express an allocation outcome.
    """
    predicted_performance: float
    risk_score: float
    completion_probability: float
    confidence: float
    model_version: str


class LearningInput(BaseModel):
    """Realised allocation outcome for model retraining."""
    skill_match_score: float
    workload_ratio: float
    task_complexity: float
    estimated_hours: float
    efficiency_score: float
    consistency_score: float
    reliability_score: float
    availability_score: float
    project_priority: float
    actual_performance_score: float
    actual_hours: float
    burnout_high_risk: int


@app.get("/")
def root():
    return {
        "service": "workforce-ml-service",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.post("/predict", response_model=MLScorePackage)
def prediction(profile: ProfileInput) -> MLScorePackage:
    return MLScorePackage(**predict(profile.model_dump()))


@app.post("/learn")
def learning(payload: LearningInput):
    return learn(payload.model_dump())