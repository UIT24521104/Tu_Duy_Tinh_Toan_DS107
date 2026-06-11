import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

const SIDEBAR_WIDTH = 260;

function Layout({ children, title, subtitle, breadcrumbs, snapshotInfo }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar width={SIDEBAR_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader snapshotInfo={snapshotInfo} />
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3, flexGrow: 1 }}>
          {breadcrumbs}
          {title && (
            <Box sx={{ mb: 3 }}>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  fontSize: { xs: 28, md: 34 },
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {title}
              </Box>
              {subtitle && (
                <Box sx={{ mt: 0.5, color: "text.secondary", fontSize: 15 }}>
                  {subtitle}
                </Box>
              )}
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
