import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { chartColors } from "../theme";

const METRICS = [
  {
    key: "historical_sold",
    title: "Lượt bán lịch sử",
    short: "Đã bán",
    description: "Tổng số lượng đã bán theo thời gian — chỉ số quan trọng nhất để đánh giá độ hot của sản phẩm.",
    unit: "",
  },
  {
    key: "liked_count",
    title: "Lượt thích",
    short: "Thích",
    description: "Số lượt thích tích lũy — phản ánh mức độ quan tâm từ người mua.",
    unit: "",
  },
  {
    key: "cmt_count",
    title: "Bình luận",
    short: "Bình luận",
    description: "Số bình luận — cho thấy mức độ tương tác và tin cậy sản phẩm.",
    unit: "",
  },
  {
    key: "price",
    title: "Giá bán",
    short: "Giá",
    description: "Biến động giá theo snapshot — hỗ trợ theo dõi chiến lược giảm giá.",
    unit: " ₫",
  },
  {
    key: "stock",
    title: "Tồn kho",
    short: "Kho",
    description: "Số lượng tồn kho còn lại — giúp nhận biết nguy cơ hết hàng.",
    unit: "",
  },
];

function formatDateLabel(date) {
  if (!date) return "";
  return date.replace(" ", "\n");
}

function MainChart({ data, metric, chartType, color }) {
  if (!data?.length) {
    return (
      <Box sx={{ height: 360, display: "grid", placeItems: "center", color: "text.secondary" }}>
        Không có dữ liệu biểu đồ
      </Box>
    );
  }

  const chartData = data.map((point) => ({
    ...point,
    label: point.date,
  }));

  if (chartType === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="index"
            name="Thứ tự"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <ZAxis range={[80, 220]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={
              <ChartTooltip
                description={metric.description}
                unit={metric.unit}
              />
            }
          />
          <Scatter
            name={metric.short}
            data={chartData.map((point, index) => ({ ...point, index: index + 1 }))}
            fill={color}
          />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "bar") {
    const lastTwo = chartData.slice(-2).map((point) => ({
      ...point,
      name: point.date?.split(" ")[0] || point.date,
    }));

    return (
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={lastTwo} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<ChartTooltip description="So sánh 2 snapshot gần nhất" unit={metric.unit} />} />
          <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={20}
        />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip content={<ChartTooltip description={metric.description} unit={metric.unit} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill={`url(#gradient-${metric.key})`}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MiniSparkline({ title, data, color }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
          {data?.length ? data[data.length - 1]?.value?.toLocaleString("vi-VN") : "—"}
        </Typography>
      </CardContent>
    </Card>
  );
}

function EngagementPie({ predictedA, predictedB }) {
  const data = [
    { name: "Tỷ lệ bình luận (a)", value: Math.max(predictedA || 0, 0), color: "#f59e0b" },
    { name: "Tỷ lệ thích (b)", value: Math.max(predictedB || 0, 0), color: "#3b82f6" },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Phân bổ dự báo engagement
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tỷ trọng giữa chỉ số a (bình luận/đã bán) và b (thích/đã bán) ở snapshot kế tiếp
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <ChartTooltip
                    active
                    payload={payload}
                    label={payload[0].name}
                    description="Giá trị dự báo cho snapshot tiếp theo"
                  />
                ) : null
              }
            />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ProductCharts({ charts, predictedA, predictedB }) {
  const [selectedMetric, setSelectedMetric] = useState("historical_sold");
  const [chartType, setChartType] = useState("trend");

  const metric = METRICS.find((item) => item.key === selectedMetric) || METRICS[0];
  const color = chartColors[selectedMetric] || "#22c55e";
  const mainData = charts?.[selectedMetric] || [];

  const growthBadge = useMemo(() => {
    const data = charts?.[selectedMetric] || [];
    if (data.length < 2) return "→ 1 snapshot";
    const prev = data[data.length - 2]?.value || 0;
    const curr = data[data.length - 1]?.value || 0;
    const diff = curr - prev;
    if (diff > 0) return `↑ +${diff.toLocaleString("vi-VN")}`;
    if (diff < 0) return `↓ ${diff.toLocaleString("vi-VN")}`;
    return "→ Không đổi";
  }, [charts, selectedMetric]);

  if (!charts) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {METRICS.map((item) => (
          <Grid item xs={6} sm={4} md={2.4} key={item.key}>
            <MiniSparkline
              title={item.short}
              data={charts[item.key] || []}
              color={chartColors[item.key]}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">Xu hướng {metric.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={growthBadge} size="small" />
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={chartType}
                    onChange={(_, value) => value && setChartType(value)}
                  >
                    <ToggleButton value="trend">
                      <ShowChartOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Trend
                    </ToggleButton>
                    <ToggleButton value="bar">
                      <BarChartOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      So sánh
                    </ToggleButton>
                    <ToggleButton value="scatter">
                      <ScatterPlotOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Scatter
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {METRICS.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.short}
                    clickable
                    onClick={() => setSelectedMetric(item.key)}
                    sx={{
                      bgcolor:
                        selectedMetric === item.key
                          ? `${chartColors[item.key]}22`
                          : "rgba(255,255,255,0.04)",
                      color: selectedMetric === item.key ? chartColors[item.key] : "text.secondary",
                      border:
                        selectedMetric === item.key
                          ? `1px solid ${chartColors[item.key]}55`
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </Stack>

              <MainChart
                data={mainData}
                metric={metric}
                chartType={chartType}
                color={color}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <EngagementPie predictedA={predictedA} predictedB={predictedB} />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default ProductCharts;
