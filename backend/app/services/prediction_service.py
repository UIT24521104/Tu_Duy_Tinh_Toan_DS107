from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd
from fastapi import HTTPException

from app.schemas.request import PredictRequest
from app.schemas.response import PredictResponse
from app.services.data_loader import data_loader
from app.services.feature_engineering import (
    build_feature_row,
    feature_row_to_model_input,
)

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_A_PATH = MODEL_DIR / "model_a.pkl"
MODEL_B_PATH = MODEL_DIR / "model_b.pkl"


@lru_cache(maxsize=1)
def _load_model_artifacts() -> tuple[dict, dict]:
    if not MODEL_A_PATH.exists() or not MODEL_B_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail="Trained models are missing. Run the training pipeline first.",
        )
    return joblib.load(MODEL_A_PATH), joblib.load(MODEL_B_PATH)


class PredictionService:
    def predict(self, request: PredictRequest) -> PredictResponse:
        df = data_loader.load()

        try:
            feature_row = build_feature_row(
                df=df,
                shopid=request.shopid,
                itemid=request.itemid,
                current_date=request.current_date,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        model_a_artifact, model_b_artifact = _load_model_artifacts()
        model_a = model_a_artifact["model"]
        model_b = model_b_artifact["model"]

        features_a = model_a_artifact["features"]
        features_b = model_b_artifact["features"]

        input_a = feature_row_to_model_input(feature_row, features_a)
        input_b = feature_row_to_model_input(feature_row, features_b)

        predicted_a = float(model_a.predict(input_a)[0])
        predicted_b = float(model_b.predict(input_b)[0])

        return PredictResponse(predicted_a=predicted_a, predicted_b=predicted_b)


prediction_service = PredictionService()
