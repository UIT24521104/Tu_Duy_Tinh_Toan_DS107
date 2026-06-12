import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import dayjs from "dayjs";
import App from "./App";
import { createAppTheme } from "./theme";
import { ColorModeContext } from "./ColorModeContext";
import "./index.css";

dayjs.locale("vi");

function getInitialMode() {
  const stored = localStorage.getItem("colorMode");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function Root() {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
    document.body.dataset.theme = mode;
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggle: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
