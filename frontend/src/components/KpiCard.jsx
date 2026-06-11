import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

function KpiCard({ icon: Icon, label, value, badge, accent = "#22c55e" }) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          background: `radial-gradient(circle at top right, ${accent}22 0%, transparent 70%)`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${accent}22`,
              color: accent,
            }}
          >
            <Icon />
          </Box>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: 24,
                bgcolor: "rgba(255,255,255,0.06)",
                color: "text.secondary",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            wordBreak: "break-word",
            fontSize: { xs: 24, md: 30 },
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default KpiCard;
