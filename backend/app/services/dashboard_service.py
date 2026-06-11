from datetime import date

import pandas as pd
from fastapi import HTTPException

from app.schemas.request import DashboardRequest
from app.schemas.response import (
    ChartPoint,
    ChartsResponse,
    DashboardResponse,
    HistoryPoint,
    SummaryResponse,
)
from app.services.data_loader import data_loader


def _safe_float(value: object, default: float = 0.0) -> float:
    if pd.isna(value):
        return default
    return float(value)


def _build_chart_series(
    history: pd.DataFrame, column: str
) -> list[ChartPoint]:
    return [
        ChartPoint(
            date=row["snapshot_time"].strftime("%Y-%m-%d %H:%M"),
            value=_safe_float(row[column]),
        )
        for _, row in history.iterrows()
    ]


class DashboardService:
    def get_dashboard(self, request: DashboardRequest) -> DashboardResponse:
        history_df = data_loader.get_product_history(
            shopid=request.shopid,
            itemid=request.itemid,
            before_date=request.current_date,
        )

        if history_df.empty:
            raise HTTPException(
                status_code=404,
                detail="No historical snapshots found before the selected date",
            )

        latest = history_df.iloc[-1]
        history_points = [
            HistoryPoint(
                snapshot_time=row["snapshot_time"].strftime("%Y-%m-%d %H:%M"),
                historical_sold=_safe_float(row["historical_sold"]),
                liked_count=_safe_float(row["liked_count"]),
                cmt_count=_safe_float(row["cmt_count"]),
                price=_safe_float(row["price"]),
                stock=_safe_float(row["stock"]),
                rating_star=_safe_float(row["rating_star"]),
            )
            for _, row in history_df.iterrows()
        ]

        return DashboardResponse(
            history=history_points,
            summary=SummaryResponse(
                name=str(latest.get("name", "")),
                price=_safe_float(latest.get("price")),
                stock=_safe_float(latest.get("stock")),
                historical_sold=_safe_float(latest.get("historical_sold")),
                rating_star=_safe_float(latest.get("rating_star")),
                rating_count=_safe_float(latest.get("rating_count")),
            ),
            charts=ChartsResponse(
                historical_sold=_build_chart_series(history_df, "historical_sold"),
                liked_count=_build_chart_series(history_df, "liked_count"),
                cmt_count=_build_chart_series(history_df, "cmt_count"),
                price=_build_chart_series(history_df, "price"),
                stock=_build_chart_series(history_df, "stock"),
            ),
        )


dashboard_service = DashboardService()
