import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import dayjs from "dayjs";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import ShopSelector from "../components/ShopSelector";
import ProductSelector from "../components/ProductSelector";
import { getProducts, getShops } from "../services/api";

const features = [
  {
    icon: QueryStatsOutlinedIcon,
    title: "Dashboard trực quan",
    text: "Theo dõi giá, tồn kho, lượt bán và tương tác theo từng snapshot.",
  },
  {
    icon: TimelineOutlinedIcon,
    title: "Biểu đồ tương tác",
    text: "Chuyển đổi Trend / So sánh / Scatter và xem tooltip giải thích tiếng Việt.",
  },
  {
    icon: RocketLaunchOutlinedIcon,
    title: "Dự báo AI",
    text: "Dự đoán chỉ số a và b cho snapshot kế tiếp bằng CatBoost.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopid, setShopid] = useState("");
  const [itemid, setItemid] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs("2026-06-01"));
  const [shopsLoading, setShopsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShops() {
      try {
        setShopsLoading(true);
        const data = await getShops();
        setShops(data);
        if (data.length > 0) {
          setShopid(String(data[0].shopid));
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Không tải được danh sách shop");
      } finally {
        setShopsLoading(false);
      }
    }

    loadShops();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (!shopid) {
        setProducts([]);
        setItemid("");
        return;
      }

      try {
        setProductsLoading(true);
        setError("");
        const data = await getProducts(Number(shopid));
        setProducts(data);
        setItemid(data.length > 0 ? String(data[0].itemid) : "");
      } catch (err) {
        setError(err.response?.data?.detail || "Không tải được danh sách sản phẩm");
        setProducts([]);
        setItemid("");
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [shopid]);

  const handleAnalyze = () => {
    if (!shopid || !itemid || !currentDate) {
      setError("Vui lòng chọn shop, sản phẩm và ngày phân tích");
      return;
    }

    navigate("/dashboard", {
      state: {
        shopid: Number(shopid),
        itemid: Number(itemid),
        current_date: currentDate.format("YYYY-MM-DD"),
      },
    });
  };

  return (
    <Layout
      title="Phân tích sản phẩm Shopee"
      subtitle="Chọn shop, sản phẩm và ngày để xem dashboard & dự báo engagement"
      snapshotInfo="Snapshot: chọn ngày phân tích → Dự báo: snapshot kế tiếp"
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: "Trang chủ", path: "/" },
            { label: "Chọn sản phẩm" },
          ]}
        />
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Bắt đầu phân tích
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Hệ thống sẽ lấy toàn bộ snapshot trước ngày bạn chọn để vẽ biểu đồ và dự báo.
              </Typography>

              <Stack spacing={2.5}>
                <ShopSelector
                  shops={shops}
                  value={shopid}
                  onChange={setShopid}
                  loading={shopsLoading}
                />
                <ProductSelector
                  products={products}
                  value={itemid}
                  onChange={setItemid}
                  loading={productsLoading}
                  disabled={!shopid}
                />
                <DatePicker
                  label="Ngày phân tích"
                  value={currentDate}
                  onChange={(value) => setCurrentDate(value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: "Chỉ lấy dữ liệu có snapshot_time nhỏ hơn ngày này",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={shopsLoading || productsLoading || !shopid || !itemid}
                  sx={{ py: 1.25 }}
                >
                  Phân tích ngay
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "action.hover",
                        color: "primary.main",
                        flexShrink: 0,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default HomePage;
