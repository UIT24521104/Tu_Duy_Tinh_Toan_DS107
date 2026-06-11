from fastapi import APIRouter

from app.schemas.request import DashboardRequest
from app.schemas.response import DashboardResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter(tags=["dashboard"])


@router.post("/dashboard", response_model=DashboardResponse)
def get_dashboard(request: DashboardRequest) -> DashboardResponse:
    return dashboard_service.get_dashboard(request)
