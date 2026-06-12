import { Box, Card, CardContent, Typography } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";

function DeltaBadge({ delta }) {
  if (delta == null || !isFinite(delta) || delta === 0) {
    return (
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>—</Typography>
    );
  }
  const up = delta > 0;
  const color = up ? "success.main" : "error.main";
  const Icon = up ? ArrowUpwardOutlinedIcon : ArrowDownwardOutlinedIcon;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, color }}>
      <Icon sx={{ fontSize: 14 }} />
      <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
        {Math.abs(delta).toFixed(1)}%
      </Typography>
    </Box>
  );
}

function KpiCard({ icon: Icon, label, value, badge, delta, accent = "#2563eb" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: `${accent}1a`,
              color: accent,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
          {delta !== undefined ? (
            <DeltaBadge delta={delta} />
          ) : (
            badge && (
              <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
                {badge}
              </Typography>
            )
          )}
        </Box>
        <Typography sx={{ fontSize: 12.5, color: "text.secondary", mb: 0.25 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            wordBreak: "break-word",
            fontSize: { xs: 18, md: 20 },
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default KpiCard;
