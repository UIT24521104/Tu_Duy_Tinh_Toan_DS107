# ---- Backend: FastAPI + CatBoost ----
FROM python:3.11-slim

WORKDIR /app

# libgomp1 cần cho CatBoost
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Cài thư viện Python trước (tận dụng cache layer)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy code backend (bao gồm app/models/*.pkl) và dữ liệu đã xử lý
COPY backend ./backend
COPY data/processed ./data/processed

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--app-dir", "backend", "--host", "0.0.0.0", "--port", "8000"]
