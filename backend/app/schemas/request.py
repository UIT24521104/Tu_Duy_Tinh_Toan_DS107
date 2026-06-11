from datetime import date

from pydantic import BaseModel, Field


class DashboardRequest(BaseModel):
    shopid: int = Field(..., description="Shop identifier")
    itemid: int = Field(..., description="Product identifier")
    current_date: date = Field(..., description="Analysis cutoff date")


class PredictRequest(BaseModel):
    shopid: int = Field(..., description="Shop identifier")
    itemid: int = Field(..., description="Product identifier")
    current_date: date = Field(..., description="Prediction cutoff date")
