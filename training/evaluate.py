import joblib
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error

from config import MODEL_A_PATH, MODEL_B_PATH, TRAINING_DATASET_PATH


def evaluate_model(model_path: str, target: str) -> None:
    df = pd.read_excel(TRAINING_DATASET_PATH)
    artifact = joblib.load(model_path)
    model = artifact["model"]
    features = artifact["features"]

    predictions = model.predict(df[features])
    mae = mean_absolute_error(df[target], predictions)
    rmse = mean_squared_error(df[target], predictions, squared=False)
    print(f"{target} - MAE = {mae:.6f}, RMSE = {rmse:.6f}")


def main() -> None:
    evaluate_model(MODEL_A_PATH, "target_a")
    evaluate_model(MODEL_B_PATH, "target_b")


if __name__ == "__main__":
    main()
