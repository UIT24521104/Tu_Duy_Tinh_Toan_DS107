from fastapi import APIRouter

from app.schemas.request import PredictRequest
from app.schemas.response import PredictResponse
from app.services.prediction_service import prediction_service

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    return prediction_service.predict(request)
