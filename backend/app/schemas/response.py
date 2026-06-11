from pydantic import BaseModel, Field


class ShopResponse(BaseModel):
    shopid: int


class ProductResponse(BaseModel):
    itemid: int
    name: str


class HistoryPoint(BaseModel):
    snapshot_time: str
    historical_sold: float
    liked_count: float
    cmt_count: float
    price: float
    stock: float
    rating_star: float


class SummaryResponse(BaseModel):
    name: str
    price: float
    stock: float
    historical_sold: float
    rating_star: float
    rating_count: float


class ChartPoint(BaseModel):
    date: str
    value: float


class ChartsResponse(BaseModel):
    historical_sold: list[ChartPoint]
    liked_count: list[ChartPoint]
    cmt_count: list[ChartPoint]
    price: list[ChartPoint]
    stock: list[ChartPoint]


class DashboardResponse(BaseModel):
    history: list[HistoryPoint]
    summary: SummaryResponse
    charts: ChartsResponse


class PredictResponse(BaseModel):
    predicted_a: float = Field(..., description="Predicted comment-to-sold ratio")
    predicted_b: float = Field(..., description="Predicted like-to-sold ratio")
