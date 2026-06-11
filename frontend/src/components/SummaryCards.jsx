import { Grid } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import KpiCard from "./KpiCard";

function SummaryCards({ summary, snapshotCount = 0 }) {
  if (!summary) {
    return null;
  }

  const cards = [
    {
      icon: ShoppingBagOutlinedIcon,
      label: "Tên sản phẩm",
      value: summary.name || "—",
      badge: "Sản phẩm đang xem",
      accent: "#22c55e",
    },
    {
      icon: PaymentsOutlinedIcon,
      label: "Giá hiện tại",
      value: `${Number(summary.price || 0).toLocaleString("vi-VN")} ₫`,
      badge: "Snapshot mới nhất",
      accent: "#a855f7",
    },
    {
      icon: Inventory2OutlinedIcon,
      label: "Tồn kho",
      value: Number(summary.stock || 0).toLocaleString("vi-VN"),
      badge: snapshotCount ? `→ ${snapshotCount} snapshots` : undefined,
      accent: "#3b82f6",
    },
    {
      icon: SellOutlinedIcon,
      label: "Đã bán (lịch sử)",
      value: Number(summary.historical_sold || 0).toLocaleString("vi-VN"),
      badge: "Chỉ số bán hàng",
      accent: "#f59e0b",
    },
    {
      icon: StarOutlineOutlinedIcon,
      label: "Đánh giá",
      value: Number(summary.rating_star || 0).toFixed(2),
      badge: `${Number(summary.rating_count || 0).toLocaleString("vi-VN")} lượt`,
      accent: "#ef4444",
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.label}>
          <KpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SummaryCards;
