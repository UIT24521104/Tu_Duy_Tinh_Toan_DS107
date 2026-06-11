from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.prediction import router as prediction_router
from app.schemas.response import ProductResponse, ShopResponse
from app.services.data_loader import data_loader


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    data_loader.load()
    yield


app = FastAPI(
    title="Shopee Product Analytics & Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(prediction_router)


@app.get("/shops", response_model=list[ShopResponse])
def get_shops() -> list[ShopResponse]:
    shops = data_loader.get_shops()
    return [ShopResponse(shopid=shopid) for shopid in shops]


@app.get("/products", response_model=list[ProductResponse])
def get_products(shopid: int = Query(..., description="Shop identifier")) -> list[ProductResponse]:
    products = data_loader.get_products(shopid)
    return [
        ProductResponse(itemid=int(row["itemid"]), name=str(row["name"]))
        for _, row in products.iterrows()
    ]


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
