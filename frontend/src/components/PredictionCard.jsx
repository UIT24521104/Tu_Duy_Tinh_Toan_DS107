import { Box, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const CONFIG = {
  a: {
    icon: ChatBubbleOutlineOutlinedIcon,
    accent: "#d97706",
    title: "Dự báo a — Bình luận / Đã bán",
    description:
      "Tỷ lệ bình luận trên mỗi đơn vị đã bán ở snapshot kế tiếp. Càng cao = tương tác mạnh hơn.",
  },
  b: {
    icon: FavoriteBorderOutlinedIcon,
    accent: "#16a34a",
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
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: `${config.accent}1a`,
              color: config.accent,
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{config.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              CatBoost · snapshot T → T+1
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 12.5, minHeight: 36 }}>
          {config.description}
        </Typography>

        <Typography
          sx={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: config.accent, mb: 1.5 }}
        >
          {loading ? "..." : (value ?? 0).toFixed(6)}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={loading ? 0 : progress}
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: "action.hover",
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
