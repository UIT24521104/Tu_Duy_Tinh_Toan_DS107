import { Box, Typography } from "@mui/material";

function ChartTooltip({ active, payload, label, unit = "", description = "" }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0];
  const value = point?.value ?? point?.payload?.value;
  const displayLabel = label || point?.name || point?.payload?.label || point?.payload?.date;

  return (
    <Box
      sx={{
        bgcolor: "#1a2230",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        minWidth: 180,
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#9ca3af", mb: 0.5 }}>
        {displayLabel}
      </Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: point?.color || point?.payload?.fill || "#f3f4f6" }}>
        {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        {unit}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default ChartTooltip;
