import { createTheme } from "@mui/material/styles";

const accent = {
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#f59e0b",
  purple: "#a855f7",
  red: "#ef4444",
};

export const chartColors = {
  historical_sold: accent.green,
  liked_count: accent.blue,
  cmt_count: accent.yellow,
  price: accent.purple,
  stock: accent.red,
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: accent.green },
    secondary: { main: accent.blue },
    background: {
      default: "#0b0f14",
      paper: "#121820",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0b0f14",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
