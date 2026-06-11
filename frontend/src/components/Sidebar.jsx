import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

const sections = [
  {
    title: "TỔNG QUAN",
    items: [
      { label: "Chọn sản phẩm", path: "/", icon: ShoppingBagOutlinedIcon },
      { label: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon },
    ],
  },
  {
    title: "PHÂN TÍCH",
    items: [
      { label: "Dự báo engagement", path: "/dashboard", icon: InsightsOutlinedIcon },
      { label: "Xu hướng", path: "/dashboard", icon: TrendingUpOutlinedIcon },
    ],
  },
];

function Sidebar({ width }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        bgcolor: "#0a0e13",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      <Box sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(34,197,94,0.15)",
            color: "#22c55e",
          }}
        >
          <AnalyticsOutlinedIcon />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>
            ShopRank AI
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Shopee Analytics
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            <Typography
              sx={{
                px: 3,
                pb: 1,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "text.secondary",
              }}
            >
              {section.title}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <ListItemButton
                    key={`${section.title}-${item.label}`}
                    selected={active}
                    onClick={() => navigate(item.path, { state: location.state })}
                    sx={{
                      mx: 1.5,
                      mb: 0.5,
                      borderRadius: 2,
                      "&.Mui-selected": {
                        bgcolor: "rgba(245,158,11,0.12)",
                        border: "1px solid rgba(245,158,11,0.35)",
                        "& .MuiListItemIcon-root": { color: "#f59e0b" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: "text.secondary" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Sidebar;
