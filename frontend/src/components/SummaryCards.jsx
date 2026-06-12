import { Grid } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import KpiCard from "./KpiCard";
import { chartColors } from "../theme";

// Tính % thay đổi giữa 2 snapshot gần nhất của một metric
function computeDelta(series) {
  if (!series || series.length < 2) return undefined;
  const prev = series[series.length - 2]?.value ?? 0;
  const curr = series[series.length - 1]?.value ?? 0;
  if (!prev) return undefined;
  return ((curr - prev) / Math.abs(prev)) * 100;
}

function SummaryCards({ summary, charts, snapshotCount = 0 }) {
  if (!summary) {
    return null;
  }

  const cards = [
    {
      icon: ShoppingBagOutlinedIcon,
      label: "Sản phẩm",
      value: summary.name || "—",
      badge: snapshotCount ? `${snapshotCount} snapshots` : "—",
      accent: "#64748b",
    },
    {
      icon: SellOutlinedIcon,
      label: "Đã bán (lịch sử)",
      value: Number(summary.historical_sold || 0).toLocaleString("vi-VN"),
      delta: computeDelta(charts?.historical_sold),
      accent: chartColors.historical_sold,
    },
    {
      icon: PaymentsOutlinedIcon,
      label: "Giá hiện tại",
      value: `${Number(summary.price || 0).toLocaleString("vi-VN")} ₫`,
      delta: computeDelta(charts?.price),
      accent: chartColors.price,
    },
    {
      icon: Inventory2OutlinedIcon,
      label: "Tồn kho",
      value: Number(summary.stock || 0).toLocaleString("vi-VN"),
      delta: computeDelta(charts?.stock),
      accent: chartColors.stock,
    },
    {
      icon: StarOutlineOutlinedIcon,
      label: "Đánh giá",
      value: Number(summary.rating_star || 0).toFixed(2),
      badge: `${Number(summary.rating_count || 0).toLocaleString("vi-VN")} lượt`,
      accent: "#d97706",
    },
  ];

  return (
    <Grid container spacing={1.5}>
      {cards.map((card) => (
        <Grid item xs={6} sm={4} md={4} lg={2.4} key={card.label}>
          <KpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SummaryCards;
