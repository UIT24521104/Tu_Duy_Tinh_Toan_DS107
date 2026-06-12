import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
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
    title: "Tổng quan",
    items: [
      { label: "Chọn sản phẩm", path: "/", icon: ShoppingBagOutlinedIcon },
      { label: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon },
    ],
  },
  {
    title: "Phân tích",
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
        bgcolor: "background.sidebar",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "#fff",
          }}
        >
          <AnalyticsOutlinedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>
            ShopRank AI
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
            Shopee Analytics
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                px: 2.5,
                pb: 0.5,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "text.secondary",
                textTransform: "uppercase",
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
                      mx: 1,
                      mb: 0.25,
                      borderRadius: 2,
                      py: 0.6,
                      color: active ? "text.primary" : "text.secondary",
                      "&:hover": { bgcolor: "action.hover" },
                      "&.Mui-selected": {
                        bgcolor: "action.selected",
                        "&:hover": { bgcolor: "action.selected" },
                        "& .MuiListItemIcon-root": { color: "primary.main" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 600 : 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          DS107 · CatBoost model
        </Typography>
      </Box>
    </Box>
  );
}

export default Sidebar;
