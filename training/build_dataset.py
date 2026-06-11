import pandas as pd

from config import DATA_PATH, TRAINING_DATASET_PATH
from feature_engineering import create_features


def main() -> None:
    df = pd.read_excel(DATA_PATH)
    featured = create_features(df)
    featured.to_excel(TRAINING_DATASET_PATH, index=False)
    print(f"Saved training dataset with shape {featured.shape} to {TRAINING_DATASET_PATH}")


if __name__ == "__main__":
    main()
