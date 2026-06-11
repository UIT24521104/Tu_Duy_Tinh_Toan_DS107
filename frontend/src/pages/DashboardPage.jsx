import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SummaryCards from "../components/SummaryCards";
import ProductCharts from "../components/ProductCharts";
import PredictionCard from "../components/PredictionCard";
import { getDashboard, predict } from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shopid, itemid, current_date: currentDate } = location.state || {};

  const [dashboardData, setDashboardData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopid || !itemid || !currentDate) {
      navigate("/");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const payload = { shopid, itemid, current_date: currentDate };
        const [dashboardResponse, predictionResponse] = await Promise.all([
          getDashboard(payload),
          predict(payload),
        ]);
        setDashboardData(dashboardResponse);
        setPredictionData(predictionResponse);
      } catch (err) {
        setError(err.response?.data?.detail || "Không tải được dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [shopid, itemid, currentDate, navigate]);

  const snapshotInfo = useMemo(() => {
    const history = dashboardData?.history || [];
    const last = history[history.length - 1]?.snapshot_time?.split(" ")[0];
    return last
      ? `Snapshot: ${last} → Dự báo: snapshot kế tiếp (trước ${currentDate})`
      : `Phân tích trước ngày ${currentDate}`;
  }, [dashboardData, currentDate]);

  const predictionMax = useMemo(() => {
    const values = [
      predictionData?.predicted_a || 0,
      predictionData?.predicted_b || 0,
      0.001,
    ];
    return Math.max(...values) * 1.2;
  }, [predictionData]);

  if (!shopid || !itemid || !currentDate) {
    return null;
  }

  return (
    <Layout
      title="Dashboard sản phẩm"
      subtitle={dashboardData?.summary?.name || `Shop ${shopid} · SP ${itemid}`}
      snapshotInfo={snapshotInfo}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: "Trang chủ", path: "/" },
            { label: "Dashboard" },
            { label: "Dự báo engagement" },
          ]}
        />
      }
    >
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate("/")}
          sx={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          Chọn sản phẩm khác
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
          <CircularProgress sx={{ color: "#22c55e" }} />
          <Typography color="text.secondary">Đang tải dashboard và mô hình dự báo...</Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          <SummaryCards
            summary={dashboardData?.summary}
            snapshotCount={dashboardData?.history?.length || 0}
          />

          <ProductCharts
            charts={dashboardData?.charts}
            predictedA={predictionData?.predicted_a}
            predictedB={predictionData?.predicted_b}
          />

          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              Dự báo engagement
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mô hình CatBoost dự đoán chỉ số a và b cho snapshot tiếp theo, tránh data leakage bằng lag features.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <PredictionCard
                  type="a"
                  value={predictionData?.predicted_a}
                  maxValue={predictionMax}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <PredictionCard
                  type="b"
                  value={predictionData?.predicted_b}
                  maxValue={predictionMax}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      )}
    </Layout>
  );
}

export default DashboardPage;
