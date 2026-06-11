import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.feature_engineering import (  # noqa: E402
    build_feature_row,
    create_features,
    extract_snapshot_time,
    feature_row_to_model_input,
)

__all__ = [
    "build_feature_row",
    "create_features",
    "extract_snapshot_time",
    "feature_row_to_model_input",
]
