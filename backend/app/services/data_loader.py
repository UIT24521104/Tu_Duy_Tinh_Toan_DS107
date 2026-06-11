from datetime import date, datetime
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.services.feature_engineering import extract_snapshot_time

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_PATH = ROOT_DIR / "data" / "processed" / "merged_data.xlsx"


class DataLoader:
    def __init__(self) -> None:
        self._df: pd.DataFrame | None = None

    def load(self) -> pd.DataFrame:
        if self._df is None:
            df = pd.read_excel(DATA_PATH)
            df["snapshot_time"] = df["source_file"].apply(extract_snapshot_time)
            self._df = df.sort_values(
                ["itemid", "shopid", "snapshot_time"]
            ).reset_index(drop=True)
        return self._df

    def get_shops(self) -> list[int]:
        df = self.load()
        return sorted(df["shopid"].dropna().unique().astype(int).tolist())

    def get_products(self, shopid: int) -> pd.DataFrame:
        df = self.load()
        products = (
            df[df["shopid"] == shopid][["itemid", "name"]]
            .drop_duplicates(subset=["itemid"])
            .sort_values("name")
        )
        return products

    def get_product_history(
        self,
        shopid: int,
        itemid: int,
        before_date: date | datetime,
    ) -> pd.DataFrame:
        df = self.load()
        cutoff = pd.Timestamp(before_date)
        history = df[
            (df["shopid"] == shopid)
            & (df["itemid"] == itemid)
            & (df["snapshot_time"] < cutoff)
        ].sort_values("snapshot_time")
        return history


data_loader = DataLoader()
