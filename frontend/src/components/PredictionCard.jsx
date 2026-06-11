import { Box, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const CONFIG = {
  a: {
    icon: ChatBubbleOutlineOutlinedIcon,
    accent: "#f59e0b",
    title: "Dự báo a — Bình luận / Đã bán",
    description:
      "Tỷ lệ bình luận trên mỗi đơn vị đã bán ở snapshot kế tiếp. Càng cao = tương tác mạnh hơn.",
  },
  b: {
    icon: FavoriteBorderOutlinedIcon,
    accent: "#3b82f6",
    title: "Dự báo b — Thích / Đã bán",
    description:
      "Tỷ lệ lượt thích trên mỗi đơn vị đã bán ở snapshot kế tiếp. Phản ánh mức quan tâm từ người dùng.",
  },
};

function PredictionCard({ type = "a", value, loading, maxValue = 1 }) {
  const config = CONFIG[type];
  const Icon = config.icon;
  const progress = Math.min(((value || 0) / maxValue) * 100, 100);

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${config.accent}12 0%, transparent 55%)`,
        },
      }}
    >
      <CardContent sx={{ position: "relative", p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${config.accent}22`,
              color: config.accent,
            }}
          >
            <Icon />
          </Box>
          <Box>
            <Typography variant="h6">{config.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              CatBoost · snapshot T → T+1
            </Typography>
          </Box>
          <AutoGraphOutlinedIcon sx={{ ml: "auto", color: "text.secondary" }} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {config.description}
        </Typography>

        <Typography
          variant="h3"
          sx={{ fontWeight: 700, color: config.accent, mb: 1.5 }}
        >
          {loading ? "..." : (value ?? 0).toFixed(6)}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={loading ? 0 : progress}
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              bgcolor: config.accent,
              borderRadius: 999,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default PredictionCard;
