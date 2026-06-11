import { Avatar, Box, Chip, Typography } from "@mui/material";

function AppHeader({ snapshotInfo }) {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 2,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(10,14,19,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Chip
          label="BETA"
          size="small"
          sx={{
            bgcolor: "rgba(34,197,94,0.15)",
            color: "#22c55e",
            fontWeight: 700,
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        />
        {snapshotInfo && (
          <Typography variant="body2" color="text.secondary">
            {snapshotInfo}
          </Typography>
        )}
      </Box>

      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "rgba(59,130,246,0.2)",
          color: "#93c5fd",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        AD
      </Avatar>
    </Box>
  );
}

export default AppHeader;
