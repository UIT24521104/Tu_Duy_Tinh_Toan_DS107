import joblib
import pandas as pd
from catboost import CatBoostRegressor

from config import MODEL_A_PATH, TRAINING_DATASET_PATH, get_feature_columns


def main() -> None:
    df = pd.read_excel(TRAINING_DATASET_PATH)
    target = "target_a"
    features = get_feature_columns(list(df.columns))

    model = CatBoostRegressor(
        iterations=1000,
        depth=6,
        learning_rate=0.03,
        loss_function="RMSE",
        verbose=100,
    )
    model.fit(df[features], df[target])

    joblib.dump({"model": model, "features": features}, MODEL_A_PATH)
    print(f"Saved model A to {MODEL_A_PATH}")


if __name__ == "__main__":
    main()
