import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.feature_engineering import get_feature_columns  # noqa: E402

DATA_PATH = ROOT_DIR / "data" / "processed" / "merged_data.xlsx"
TRAINING_DATASET_PATH = ROOT_DIR / "data" / "processed" / "training_dataset.xlsx"

MODEL_DIR = ROOT_DIR / "backend" / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_A_PATH = MODEL_DIR / "model_a.pkl"
MODEL_B_PATH = MODEL_DIR / "model_b.pkl"
