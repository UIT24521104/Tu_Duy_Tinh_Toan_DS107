import joblib
import pandas as pd
from catboost import CatBoostRegressor

from config import MODEL_B_PATH, TRAINING_DATASET_PATH, get_feature_columns


def main() -> None:
    df = pd.read_excel(TRAINING_DATASET_PATH)
    target = "target_b"
    features = get_feature_columns(list(df.columns))

    model = CatBoostRegressor(
        iterations=1000,
        depth=6,
        learning_rate=0.03,
        loss_function="RMSE",
        verbose=100,
    )
    model.fit(df[features], df[target])

    joblib.dump({"model": model, "features": features}, MODEL_B_PATH)
    print(f"Saved model B to {MODEL_B_PATH}")


if __name__ == "__main__":
    main()
