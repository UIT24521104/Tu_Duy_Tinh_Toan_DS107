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
  useTheme,
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
import { chartColors, getChartTheme } from "../theme";

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
  const theme = useTheme();
  const axis = getChartTheme(theme.palette.mode);

  if (!data?.length) {
    return (
      <Box sx={{ height: 340, display: "grid", placeItems: "center", color: "text.secondary" }}>
        Không có dữ liệu biểu đồ
      </Box>
    );
  }

  const chartData = data.map((point) => ({ ...point, label: point.date }));
  const tickStyle = { fill: axis.tick, fontSize: 11 };

  if (chartType === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke={axis.grid} strokeDasharray="3 3" />
          <XAxis type="number" dataKey="index" name="Thứ tự" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={56} />
          <ZAxis range={[70, 200]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: axis.grid }}
            content={<ChartTooltip description={metric.description} unit={metric.unit} />}
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
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={lastTwo} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke={axis.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={56} />
          <Tooltip cursor={{ fill: axis.grid }} content={<ChartTooltip description="So sánh 2 snapshot gần nhất" unit={metric.unit} />} />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={64} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={axis.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tick={tickStyle}
          axisLine={false}
          tickLine={false}
          minTickGap={20}
        />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={56} />
        <Tooltip content={<ChartTooltip description={metric.description} unit={metric.unit} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${metric.key})`}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MiniSparkline({ title, data, color, active, onClick }) {
  const last = data?.length ? data[data.length - 1]?.value : null;
  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "border-color 0.15s ease",
        borderColor: active ? color : "divider",
        "&:hover": { borderColor: color },
      }}
    >
      <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 0.5 }}>
          {last != null ? last.toLocaleString("vi-VN") : "—"}
        </Typography>
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.75} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function EngagementPie({ predictedA, predictedB }) {
  const data = [
    { name: "Tỷ lệ bình luận (a)", value: Math.max(predictedA || 0, 0), color: chartColors.cmt_count },
    { name: "Tỷ lệ thích (b)", value: Math.max(predictedB || 0, 0), color: chartColors.liked_count },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontSize: 15 }} gutterBottom>
          Phân bổ dự báo engagement
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
          Tỷ trọng giữa chỉ số a (bình luận/đã bán) và b (thích/đã bán) ở snapshot kế tiếp
        </Typography>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
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
            <Legend wrapperStyle={{ fontSize: 12 }} />
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
  const color = chartColors[selectedMetric] || chartColors.historical_sold;
  const mainData = charts?.[selectedMetric] || [];

  const growthBadge = useMemo(() => {
    const data = charts?.[selectedMetric] || [];
    if (data.length < 2) return "1 snapshot";
    const prev = data[data.length - 2]?.value || 0;
    const curr = data[data.length - 1]?.value || 0;
    const diff = curr - prev;
    if (diff > 0) return `↑ +${diff.toLocaleString("vi-VN")}`;
    if (diff < 0) return `↓ ${diff.toLocaleString("vi-VN")}`;
    return "Không đổi";
  }, [charts, selectedMetric]);

  if (!charts) {
    return null;
  }

  return (
    <Stack spacing={1.5}>
      <Grid container spacing={1.5}>
        {METRICS.map((item) => (
          <Grid item xs={6} sm={4} md={2.4} key={item.key}>
            <MiniSparkline
              title={item.short}
              data={charts[item.key] || []}
              color={chartColors[item.key]}
              active={selectedMetric === item.key}
              onClick={() => setSelectedMetric(item.key)}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={1.5}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontSize: 15 }}>
                    Xu hướng {metric.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                    {metric.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                  <Chip
                    label={growthBadge}
                    size="small"
                    sx={{ bgcolor: "action.hover", color: "text.secondary" }}
                  />
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
                {METRICS.map((item) => {
                  const isActive = selectedMetric === item.key;
                  return (
                    <Chip
                      key={item.key}
                      label={item.short}
                      clickable
                      size="small"
                      onClick={() => setSelectedMetric(item.key)}
                      sx={{
                        bgcolor: isActive ? `${chartColors[item.key]}1a` : "transparent",
                        color: isActive ? chartColors[item.key] : "text.secondary",
                        border: "1px solid",
                        borderColor: isActive ? `${chartColors[item.key]}55` : "divider",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  );
                })}
              </Stack>

              <MainChart data={mainData} metric={metric} chartType={chartType} color={color} />
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
