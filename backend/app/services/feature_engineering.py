import re
from datetime import date, datetime
import numpy as np
import pandas as pd

LAG_COLS: list[str] = [
    "historical_sold",
    "liked_count",
    "cmt_count",
    "price",
    "stock",
    "rating_star",
    "rating_count",
]

ROLLING_COLS: list[str] = [
    "historical_sold",
    "liked_count",
    "cmt_count",
    "price",
    "stock",
    "rating_star",
]

GROUP_COLS: list[str] = ["itemid", "shopid"]

EXCLUDE_COLUMNS: list[str] = [
    "target_a",
    "target_b",
    "a",
    "b",
    "source_file",
    "name",
    "label_ids",
    "brand",
    "currency",
    "itemid",
    "shopid",
    "snapshot_time",
]

LEAKAGE_COLUMNS: list[str] = [
    "historical_sold",
    "liked_count",
    "cmt_count",
    "price",
    "stock",
    "rating_star",
    "rating_count",
    "sold",
    "one_rating",
    "two_rating",
    "three_rating",
    "four_rating",
    "five_rating",
]


METADATA_COLUMNS: list[str] = [
    "status",
    "ctime",
    "catid",
    "flag",
    "cb_option",
    "discount",
    "shop_location",
]

ENGINEERED_FEATURE_COLUMNS: list[str] = (
    [f"{col}_lag1" for col in LAG_COLS]
    + [f"{col}_mean3" for col in ROLLING_COLS]
    + [
        "sold_growth",
        "like_growth",
        "comment_growth",
        "snapshot_count",
        "days_since_first_seen",
        "shop_avg_price",
        "shop_avg_rating",
        "shop_avg_sold",
    ]
)


def get_feature_columns(columns: list[str]) -> list[str]:
    available = set(columns)
    return [column for column in ENGINEERED_FEATURE_COLUMNS if column in available]


def extract_snapshot_time(source_file: str) -> pd.Timestamp:
    match = re.search(r"(\d{8})_(\d{4})", str(source_file))
    if not match:
        return pd.NaT

    date_part = match.group(1)
    time_part = match.group(2)
    return pd.to_datetime(date_part + time_part, format="%Y%m%d%H%M")


def _add_snapshot_time(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    result["snapshot_time"] = result["source_file"].apply(extract_snapshot_time)
    return result.sort_values(GROUP_COLS + ["snapshot_time"])


def _add_targets(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    sold = result["historical_sold"].replace(0, np.nan)
    result["a"] = result["cmt_count"] / sold
    result["b"] = result["liked_count"] / sold
    result["target_a"] = result.groupby(GROUP_COLS)["a"].shift(-1)
    result["target_b"] = result.groupby(GROUP_COLS)["b"].shift(-1)
    return result


def _add_lag_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    for col in LAG_COLS:
        result[f"{col}_lag1"] = result.groupby(GROUP_COLS)[col].shift(1)
    return result


def _add_rolling_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    for col in ROLLING_COLS:
        result[f"{col}_mean3"] = result.groupby(GROUP_COLS)[col].transform(
            lambda series: series.shift(1).rolling(window=3, min_periods=1).mean()
        )
    return result


def _add_growth_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    result["sold_growth"] = result["historical_sold_lag1"] - result.groupby(
        GROUP_COLS
    )["historical_sold"].shift(2)
    result["like_growth"] = result["liked_count_lag1"] - result.groupby(
        GROUP_COLS
    )["liked_count"].shift(2)
    result["comment_growth"] = result["cmt_count_lag1"] - result.groupby(
        GROUP_COLS
    )["cmt_count"].shift(2)
    return result


def _add_history_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    result["snapshot_count"] = result.groupby(GROUP_COLS).cumcount()
    first_seen = result.groupby(GROUP_COLS)["snapshot_time"].transform("min")
    result["days_since_first_seen"] = (
        result["snapshot_time"] - first_seen
    ).dt.days
    return result


def _add_shop_aggregation_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    shop_stats = (
        result.groupby(["shopid", "snapshot_time"])
        .agg(
            shop_avg_price=("price", "mean"),
            shop_avg_rating=("rating_star", "mean"),
            shop_avg_sold=("historical_sold", "mean"),
        )
        .reset_index()
    )

    result = result.merge(shop_stats, on=["shopid", "snapshot_time"], how="left")

    for col in ["shop_avg_price", "shop_avg_rating", "shop_avg_sold"]:
        result[col] = result.groupby(GROUP_COLS)[col].shift(1)

    return result


def create_features(df: pd.DataFrame, drop_missing_targets: bool = True) -> pd.DataFrame:
    result = _add_snapshot_time(df)
    result = _add_targets(result)
    result = _add_lag_features(result)
    result = _add_rolling_features(result)
    result = _add_growth_features(result)
    result = _add_history_features(result)
    result = _add_shop_aggregation_features(result)

    if drop_missing_targets:
        result = result.dropna(subset=["target_a", "target_b"])

    return result.reset_index(drop=True)


def _normalize_current_date(current_date: date | datetime | str) -> pd.Timestamp:
    if isinstance(current_date, datetime):
        return pd.Timestamp(current_date)
    if isinstance(current_date, date):
        return pd.Timestamp(current_date)
    return pd.to_datetime(current_date)


def build_feature_row(
    df: pd.DataFrame,
    shopid: int,
    itemid: int,
    current_date: date | datetime | str,
) -> pd.Series:
    cutoff = _normalize_current_date(current_date)
    product_df = df[(df["shopid"] == shopid) & (df["itemid"] == itemid)].copy()

    if product_df.empty:
        raise ValueError(f"Product not found for shopid={shopid}, itemid={itemid}")

    featured = create_features(df, drop_missing_targets=False)
    featured = featured[
        (featured["shopid"] == shopid)
        & (featured["itemid"] == itemid)
        & (featured["snapshot_time"] < cutoff)
    ]

    if featured.empty:
        raise ValueError(
            "Insufficient history before the selected date for feature generation"
        )

    return featured.sort_values("snapshot_time").iloc[-1]


def feature_row_to_model_input(
    feature_row: pd.Series, feature_names: list[str]
) -> pd.DataFrame:
    model_input = feature_row.reindex(feature_names).to_frame().T
    return model_input.fillna(0)
