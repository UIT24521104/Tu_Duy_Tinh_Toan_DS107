import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useColorMode } from "../ColorModeContext";

function AppHeader({ snapshotInfo }) {
  const { mode, toggle } = useColorMode();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: (t) =>
          t.palette.mode === "dark"
            ? "rgba(25,25,25,0.8)"
            : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {snapshotInfo && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {snapshotInfo}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={mode === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
          <IconButton
            onClick={toggle}
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "action.selected",
            color: "text.primary",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          AD
        </Avatar>
      </Box>
    </Box>
  );
}

export default AppHeader;
