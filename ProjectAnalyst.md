# ProjectAnalyst — Phân tích kiến trúc dự án DS107

> **Tên dự án:** Shopee Product Analytics & Prediction (Tu_Duy_Tinh_Toan_DS107)
> **Mục tiêu:** Thu thập dữ liệu sản phẩm Shopee theo thời gian (snapshot), trực quan hoá lịch sử biến động và **dự báo chỉ số engagement** (tỉ lệ comment/sold và like/sold) cho snapshot kế tiếp bằng mô hình Machine Learning (CatBoost).

---

## 1. Tổng quan dự án

Dự án là một hệ thống **phân tích & dự báo cho sản phẩm thương mại điện tử (Shopee)**, gồm ba phần lớn vận hành quanh một bộ dữ liệu chung:

1. **Pipeline dữ liệu & huấn luyện (offline)** — gộp dữ liệu thô, sinh feature, huấn luyện và đánh giá mô hình.
2. **Backend API (online)** — phục vụ dữ liệu dashboard và thực hiện dự báo theo yêu cầu.
3. **Frontend SPA (online)** — giao diện cho người dùng chọn shop/sản phẩm/ngày và xem kết quả.

Hai bài toán dự báo chính (regression):

| Chỉ số | Ý nghĩa | Công thức |
|--------|---------|-----------|
| `a` (target_a) | Tỉ lệ bình luận trên lượt bán | `cmt_count / historical_sold` |
| `b` (target_b) | Tỉ lệ lượt thích trên lượt bán | `liked_count / historical_sold` |

Cả hai target đều được tính cho **snapshot kế tiếp** (`shift(-1)` theo từng sản phẩm), nên đây là bài toán **dự báo chuỗi thời gian** dưới dạng supervised regression.

---

## 2. Kiến trúc tổng thể (Software Architecture)

Dự án theo mô hình **kiến trúc phân lớp (layered architecture)** kết hợp **client–server tách biệt** (decoupled SPA + REST API), và một **pipeline ML offline** dùng chung tầng feature engineering với backend.

```
┌────────────────────────────────────────────────────────────────────────┐
│                            NGƯỜI DÙNG (Browser)                          │
└───────────────────────────────┬────────────────────────────────────────┘
                                 │  HTTP (qua Vite dev proxy /api → :8000)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND — React SPA (Vite)                          │
│  pages/ (HomePage, DashboardPage)                                        │
│  components/ (KpiCard, ProductCharts, PredictionCard, Selectors, ...)    │
│  services/api.js  →  axios client (getShops/getProducts/dashboard/predict)│
└───────────────────────────────┬────────────────────────────────────────┘
                                 │  REST/JSON
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       BACKEND — FastAPI (Uvicorn)                        │
│                                                                          │
│  api/        (controllers)   dashboard.py · prediction.py · main.py     │
│      │                                                                   │
│      ▼                                                                   │
│  services/   (business)      dashboard_service · prediction_service     │
│      │                       data_loader · feature_engineering          │
│      ▼                                                                   │
│  schemas/    (DTO/contract)  request.py · response.py  (Pydantic)       │
│      │                                                                   │
│      ▼                                                                   │
│  models/     (artifacts)     model_a.pkl · model_b.pkl  (CatBoost)      │
└───────────────────────────────┬────────────────────────────────────────┘
                                 │ đọc
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER (file-based)                         │
│  data/raw/*.xlsx (snapshot thô)  →  data/processed/merged_data.xlsx      │
│                                  →  data/processed/training_dataset.xlsx │
└────────────────────────────────────────────────────────────────────────┘
                                 ▲
                                 │ dùng chung tầng feature_engineering
┌────────────────────────────────┴───────────────────────────────────────┐
│              TRAINING PIPELINE (offline, chạy thủ công)                  │
│  merge_data.py → build_dataset.py → train_model_a/b.py → evaluate.py     │
└────────────────────────────────────────────────────────────────────────┘
```

### Nguyên tắc thiết kế chính

- **Tách lớp rõ ràng (Separation of Concerns):** Controller (`api/`) chỉ định tuyến và uỷ thác; logic nghiệp vụ nằm ở `services/`; hợp đồng dữ liệu nằm ở `schemas/`. Controller "mỏng", service "dày".
- **Dùng chung feature engineering giữa training và serving:** `training/config.py` chèn `backend/` vào `sys.path` để import đúng module `app.services.feature_engineering`. Điều này **đảm bảo train/serving consistency** — đặc trưng lúc dự báo được sinh y hệt lúc huấn luyện, tránh skew.
- **Chống rò rỉ dữ liệu (data leakage):** mọi đặc trưng dùng cho model đều là **lag/rolling/growth của quá khứ** (`shift(1)`, `rolling().shift(1)`). Các cột giá trị hiện tại được liệt kê trong `LEAKAGE_COLUMNS` và **không** đưa vào model.
- **Singleton + cache cho tài nguyên nặng:** dữ liệu và model được nạp một lần và tái sử dụng (xem mục Hiệu năng).
- **Stateless API:** mọi request mang đủ ngữ cảnh (`shopid`, `itemid`, `current_date`); backend không lưu phiên.

---

## 3. Cấu trúc thư mục

```
DS107/
├── backend/
│   ├── app/
│   │   ├── main.py                  # Khởi tạo FastAPI, CORS, lifespan, route /shops /products /health
│   │   ├── api/                     # Tầng controller (router)
│   │   │   ├── dashboard.py         #   POST /dashboard
│   │   │   └── prediction.py        #   POST /predict
│   │   ├── services/                # Tầng nghiệp vụ
│   │   │   ├── data_loader.py       #   Nạp & cache dữ liệu, truy vấn shop/product/history
│   │   │   ├── feature_engineering.py  # Sinh đặc trưng (dùng chung với training)
│   │   │   ├── dashboard_service.py #   Tổng hợp dữ liệu dashboard
│   │   │   └── prediction_service.py#   Nạp model + dự báo
│   │   ├── schemas/                 # Pydantic DTO
│   │   │   ├── request.py           #   DashboardRequest, PredictRequest
│   │   │   └── response.py          #   *Response, ChartPoint, HistoryPoint, ...
│   │   └── models/                  # Artifact đã train
│   │       ├── model_a.pkl
│   │       └── model_b.pkl
│   ├── requirements.txt
│   └── test_api.py
│
├── training/                        # Pipeline ML offline
│   ├── config.py                    # Đường dẫn + cầu nối import sang backend
│   ├── build_dataset.py             # merged_data → training_dataset (sinh feature + target)
│   ├── feature_engineering.py       # (đối chiếu/biến thể của bản ở backend)
│   ├── train_model_a.py             # Huấn luyện CatBoost cho target_a
│   ├── train_model_b.py             # Huấn luyện CatBoost cho target_b
│   ├── evaluate.py                  # MAE / RMSE
│   └── catboost_info/               # Log huấn luyện CatBoost
│
├── models/
│   └── merge_data.py                # Gộp data/raw/*.xlsx → merged_data.xlsx
│
├── data/
│   ├── raw/                         # Các snapshot Shopee_Data_YYYYMMDD_HHMM.xlsx
│   └── processed/
│       ├── merged_data.xlsx         # Dữ liệu đã gộp
│       └── training_dataset.xlsx    # Dữ liệu đã sinh feature/target
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx, App.jsx        # Bootstrap + định tuyến
│   │   ├── theme.js                 # MUI theme (dark)
│   │   ├── pages/                   # HomePage, DashboardPage
│   │   ├── components/              # KpiCard, ProductCharts, PredictionCard, Selectors, Layout...
│   │   └── services/api.js          # axios client
│   ├── vite.config.js               # Dev server + proxy /api → backend
│   └── package.json
│
└── README.md
```

---

## 4. Công nghệ sử dụng (Tech Stack)

### Backend
| Thành phần | Công nghệ | Vai trò |
|-----------|-----------|---------|
| Web framework | **FastAPI** | Định nghĩa REST API, validation, OpenAPI docs tự động |
| ASGI server | **Uvicorn** (`[standard]`) | Chạy ứng dụng async |
| Validation/DTO | **Pydantic** | Định nghĩa schema request/response, ép kiểu & kiểm tra |
| Xử lý dữ liệu | **pandas**, **numpy** | Đọc Excel, groupby, lag/rolling, tổng hợp |
| Đọc Excel | **openpyxl** | Engine cho `pd.read_excel` |
| Machine Learning | **CatBoost** (`CatBoostRegressor`) | Mô hình dự báo gradient boosting |
| Đánh giá | **scikit-learn** | MAE, RMSE |
| Lưu/nạp model | **joblib** | Serialize artifact `{model, features}` |
| Upload | **python-multipart** | Hỗ trợ form/multipart |

### Frontend
| Thành phần | Công nghệ | Vai trò |
|-----------|-----------|---------|
| UI library | **React 19** | Xây dựng giao diện component-based |
| Build tool | **Vite 6** | Dev server cực nhanh, bundling, proxy API |
| Component lib | **MUI (Material UI) v6** + icons | Card, Grid, Button, Alert, theme... |
| Date picker | **@mui/x-date-pickers** + **dayjs** | Chọn ngày phân tích |
| Styling | **@emotion/react, @emotion/styled** | CSS-in-JS (nền tảng của MUI) |
| Routing | **react-router-dom v7** | Điều hướng `/` và `/dashboard` |
| HTTP client | **axios** | Gọi REST API |
| Biểu đồ | **recharts** | Vẽ trend / so sánh / scatter |

### Dữ liệu & ML pipeline
- **Định dạng dữ liệu:** Excel (`.xlsx`) — cả raw, merged lẫn training dataset.
- **Mô hình:** Hai mô hình CatBoost độc lập (`model_a`, `model_b`), mỗi mô hình `iterations=1000, depth=6, learning_rate=0.03, loss=RMSE`.
- **Artifact:** mỗi `.pkl` lưu `dict` gồm `model` và danh sách `features` để serving tái lập đúng thứ tự cột.

---

## 5. Luồng dữ liệu chi tiết (Data Flow)

### 5.1. Pipeline offline (chuẩn bị mô hình)

```
data/raw/*.xlsx
   │  models/merge_data.py  (gộp nhiều snapshot + thêm cột source_file)
   ▼
data/processed/merged_data.xlsx
   │  training/build_dataset.py → feature_engineering.create_features()
   │     • extract_snapshot_time (từ tên file source_file → timestamp)
   │     • _add_targets        (a, b, target_a/target_b = shift(-1))
   │     • _add_lag_features   (lag1 cho 7 cột)
   │     • _add_rolling_features (mean3, đã shift để không leak)
   │     • _add_growth_features  (sold/like/comment growth)
   │     • _add_history_features (snapshot_count, days_since_first_seen)
   │     • _add_shop_aggregation_features (shop_avg_price/rating/sold, đã shift)
   │     • dropna(target_a, target_b)
   ▼
data/processed/training_dataset.xlsx
   │  training/train_model_a.py & train_model_b.py
   ▼
backend/app/models/model_a.pkl , model_b.pkl
   │  training/evaluate.py → in MAE/RMSE
```

**Đặc trưng đầu vào mô hình** (`ENGINEERED_FEATURE_COLUMNS`):
- `*_lag1` (7 cột: historical_sold, liked_count, cmt_count, price, stock, rating_star, rating_count)
- `*_mean3` (6 cột rolling)
- `sold_growth`, `like_growth`, `comment_growth`
- `snapshot_count`, `days_since_first_seen`
- `shop_avg_price`, `shop_avg_rating`, `shop_avg_sold`

> Tất cả đều là thông tin **trong quá khứ** → tránh leakage một cách có chủ đích.

### 5.2. Luồng online (serving)

**Khởi động:** `main.py` dùng `lifespan` để gọi `data_loader.load()` một lần khi server start (warm-up: đọc Excel, parse `snapshot_time`, sort).

**Dashboard** — `POST /dashboard`:
```
DashboardRequest {shopid, itemid, current_date}
   → dashboard_service.get_dashboard()
   → data_loader.get_product_history()  (lọc snapshot_time < current_date)
   → tổng hợp summary + chuỗi chart (sold, like, comment, price, stock)
   → DashboardResponse
```

**Dự báo** — `POST /predict`:
```
PredictRequest {shopid, itemid, current_date}
   → prediction_service.predict()
   → feature_engineering.build_feature_row()  (lấy feature row mới nhất trước current_date)
   → _load_model_artifacts()  (joblib, có lru_cache)
   → feature_row_to_model_input() reindex theo features từng model
   → model_a.predict / model_b.predict
   → PredictResponse {predicted_a, predicted_b}
```

**Frontend** gọi cả hai endpoint **song song** (`Promise.all`) trong `DashboardPage` để vừa hiển thị lịch sử vừa hiển thị dự báo.

---

## 6. API Endpoints

| Method | Path | Mô tả | Request | Response |
|--------|------|-------|---------|----------|
| GET | `/shops` | Danh sách shop | — | `[ShopResponse]` |
| GET | `/products?shopid=` | Sản phẩm theo shop | query `shopid` | `[ProductResponse]` |
| POST | `/dashboard` | Dữ liệu dashboard (history, summary, charts) | `DashboardRequest` | `DashboardResponse` |
| POST | `/predict` | Dự báo chỉ số a, b | `PredictRequest` | `PredictResponse` |
| GET | `/health` | Health check | — | `{status: "ok"}` |

CORS được mở cho `http://localhost:5173` và `http://127.0.0.1:5173` (frontend dev). Tài liệu API tự động tại `/docs` (Swagger) nhờ FastAPI.

---

## 7. Frontend Architecture

- **SPA định tuyến client-side** với 2 trang:
  - `HomePage` (`/`): chọn shop → load sản phẩm → chọn ngày → điều hướng sang dashboard (truyền state qua `react-router`).
  - `DashboardPage` (`/dashboard`): nạp song song dashboard + prediction, hiển thị `SummaryCards`, `ProductCharts`, `PredictionCard`.
- **Tổ chức theo trách nhiệm:** `pages/` (màn hình) · `components/` (UI tái sử dụng) · `services/api.js` (tầng giao tiếp) · `theme.js` (giao diện tối).
- **Giao tiếp backend:** axios `baseURL: "/api"`, được Vite proxy `rewrite` về `http://localhost:8000` (loại tiền tố `/api`). Nhờ proxy nên tránh được vấn đề CORS khi dev và không hard-code domain backend.
- **UX bản địa hoá tiếng Việt**, theme tối, biểu đồ có tooltip giải thích.

---

## 8. Điểm nhấn kỹ thuật (Engineering Highlights)

1. **Train/Serving consistency:** dùng chung một module feature engineering qua thủ thuật `sys.path` trong `training/config.py` → đặc trưng nhất quán tuyệt đối giữa lúc train và lúc dự báo.
2. **Phòng chống data leakage một cách hệ thống:** danh sách `LEAKAGE_COLUMNS` + toàn bộ feature đều `shift` về quá khứ; target là `shift(-1)` của tương lai.
3. **Trích timestamp từ tên file:** `extract_snapshot_time` regex `YYYYMMDD_HHMM` từ `source_file` → tạo trục thời gian cho chuỗi snapshot.
4. **Tối ưu hiệu năng nạp tài nguyên:**
   - `DataLoader` là **singleton** giữ DataFrame trong RAM (`self._df`), chỉ đọc Excel một lần.
   - `_load_model_artifacts()` bọc **`@lru_cache`** → model chỉ deserialize một lần.
   - Warm-up dữ liệu ngay khi server khởi động qua `lifespan`.
5. **Xử lý lỗi rõ ràng:** `HTTPException` 400 (thiếu lịch sử / sản phẩm không tồn tại), 404 (không có snapshot), 500 (thiếu model) — trả `detail` để frontend hiển thị.
6. **Hợp đồng dữ liệu chặt chẽ** nhờ Pydantic: request được validate (kiểu `int`, `date`), response có schema cố định.

---

## 9. Cách chạy dự án

**Backend** (từ thư mục gốc):
```bash
python -m venv .venv
.\.venv\Scripts\activate          # Windows  (Linux/macOS: source .venv/bin/activate)
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install        # chỉ lần đầu
npm run dev        # http://localhost:5173
```

**Huấn luyện lại mô hình (tuỳ chọn):**
```bash
python models/merge_data.py        # gộp raw → merged_data.xlsx  (lưu ý đường dẫn ~/shopee_pipeline)
cd training
python build_dataset.py            # sinh training_dataset.xlsx
python train_model_a.py
python train_model_b.py
python evaluate.py                 # in MAE / RMSE
```

---

## 10. Nhận xét & hướng phát triển

**Điểm mạnh:** kiến trúc phân lớp gọn, tách biệt rõ ràng; chống leakage tốt; train/serving thống nhất; tận dụng cache hợp lý.

**Điểm có thể cải thiện:**
- **Lưu trữ dữ liệu:** đang dùng Excel làm "database" → nên chuyển sang DB (SQLite/PostgreSQL) hoặc Parquet để truy vấn nhanh, đồng thời và bền vững hơn.
- **Tách bạch hai bản `feature_engineering`** (ở `backend/app/services/` và `training/`) — hiện có khả năng trùng lặp/lệch; nên dùng một nguồn duy nhất (đã có cầu nối qua `config.py`, nên loại bỏ bản thừa nếu có).
- **Phân tách train/validation/test theo thời gian** thay vì đánh giá trên chính tập train (`evaluate.py` đang dự báo trên toàn bộ training_dataset → nguy cơ ước lượng lạc quan).
- **CI/CD & containerization** (Docker) cho cả backend lẫn frontend.
- **Đường dẫn cứng** trong `models/merge_data.py` (`~/shopee_pipeline/...`) chưa khớp cấu trúc repo `data/raw` — nên tham số hoá.
- **Versioning cho model & dataset** (MLflow / DVC) để theo dõi thí nghiệm.
- **Bổ sung test** (hiện chỉ có `backend/test_api.py`).
