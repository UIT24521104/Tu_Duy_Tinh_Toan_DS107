"""Smoke tests for the FastAPI application."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_shops_and_products() -> None:
    shops_response = client.get("/shops")
    assert shops_response.status_code == 200
    shops = shops_response.json()
    assert len(shops) > 0

    shopid = shops[0]["shopid"]
    products_response = client.get("/products", params={"shopid": shopid})
    assert products_response.status_code == 200
    products = products_response.json()
    assert len(products) > 0


def test_dashboard_and_predict() -> None:
    shops = client.get("/shops").json()
    shopid = shops[0]["shopid"]
    products = client.get("/products", params={"shopid": shopid}).json()
    itemid = products[0]["itemid"]

    payload = {
        "shopid": shopid,
        "itemid": itemid,
        "current_date": "2026-06-06",
    }

    dashboard_response = client.post("/dashboard", json=payload)
    assert dashboard_response.status_code == 200
    dashboard = dashboard_response.json()
    assert "history" in dashboard
    assert "summary" in dashboard
    assert "charts" in dashboard
    assert len(dashboard["history"]) > 0

    predict_response = client.post("/predict", json=payload)
    assert predict_response.status_code == 200
    prediction = predict_response.json()
    assert "predicted_a" in prediction
    assert "predicted_b" in prediction


if __name__ == "__main__":
    test_health()
    test_shops_and_products()
    test_dashboard_and_predict()
    print("All smoke tests passed.")
