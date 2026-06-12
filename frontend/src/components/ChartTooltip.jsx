import { Box, Typography } from "@mui/material";

function ChartTooltip({ active, payload, label, unit = "", description = "" }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0];
  const value = point?.value ?? point?.payload?.value;
  const displayLabel =
    label || point?.name || point?.payload?.label || point?.payload?.date;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 1.75,
        py: 1.25,
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "0 8px 24px rgba(0,0,0,0.5)"
            : "0 8px 24px rgba(0,0,0,0.12)",
        minWidth: 170,
      }}
    >
      <Typography sx={{ fontSize: 11.5, color: "text.secondary", mb: 0.5 }}>
        {displayLabel}
      </Typography>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: point?.color || point?.payload?.fill || "text.primary",
        }}
      >
        {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        {unit}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: 11.5, color: "text.secondary", mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default ChartTooltip;
