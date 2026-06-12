import { createTheme } from "@mui/material/styles";

// Bảng màu cho biểu đồ — đọc tốt trên cả nền sáng lẫn tối (đã giảm độ chói)
export const chartColors = {
  historical_sold: "#2563eb", // blue
  liked_count: "#16a34a", // green
  cmt_count: "#d97706", // amber
  price: "#7c3aed", // violet
  stock: "#dc2626", // red
};

const tokens = {
  light: {
    bg: "#ffffff",
    subtle: "#f7f7f5",
    paper: "#ffffff",
    sidebar: "#fbfbfa",
    text: "#37352f",
    textSecondary: "#787774",
    border: "rgba(55,53,47,0.10)",
    hover: "rgba(55,53,47,0.05)",
    selected: "rgba(55,53,47,0.08)",
  },
  dark: {
    bg: "#191919",
    subtle: "#1f1f1f",
    paper: "#202020",
    sidebar: "#161616",
    text: "rgba(255,255,255,0.88)",
    textSecondary: "rgba(255,255,255,0.46)",
    border: "rgba(255,255,255,0.10)",
    hover: "rgba(255,255,255,0.055)",
    selected: "rgba(255,255,255,0.09)",
  },
};

export function getTokens(mode) {
  return tokens[mode] || tokens.light;
}

// Màu trục / lưới / tooltip cho recharts theo mode
export function getChartTheme(mode) {
  const t = getTokens(mode);
  return {
    grid: mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(55,53,47,0.08)",
    tick: t.textSecondary,
    tooltipBg: t.paper,
    tooltipBorder: t.border,
  };
}

export function createAppTheme(mode) {
  const t = getTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: "#2563eb" },
      secondary: { main: "#16a34a" },
      success: { main: "#16a34a" },
      error: { main: "#dc2626" },
      background: {
        default: t.bg,
        paper: t.paper,
        subtle: t.subtle,
        sidebar: t.sidebar,
      },
      text: { primary: t.text, secondary: t.textSecondary },
      divider: t.border,
      action: {
        hover: t.hover,
        selected: t.selected,
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.015em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      button: { fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: t.bg, transition: "background-color 0.2s ease" },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${t.border}`,
            boxShadow: "none",
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 8, fontWeight: 500 },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            border: `1px solid ${t.border}`,
            color: t.textSecondary,
            "&.Mui-selected": {
              backgroundColor: t.selected,
              color: t.text,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: { borderColor: t.border },
        },
      },
    },
  });
}

export default createAppTheme("light");
