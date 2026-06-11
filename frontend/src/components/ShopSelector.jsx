import { FormControl, InputLabel, MenuItem, Select, CircularProgress, Box } from "@mui/material";

function ShopSelector({ shops, value, onChange, loading, disabled }) {
  return (
    <FormControl fullWidth disabled={disabled || loading}>
      <InputLabel id="shop-select-label">Cửa hàng</InputLabel>
      <Select
        labelId="shop-select-label"
        label="Cửa hàng"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        endAdornment={
          loading ? (
            <Box sx={{ display: "flex", pr: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : null
        }
      >
        {shops.map((shop) => (
          <MenuItem key={shop.shopid} value={String(shop.shopid)}>
            Shop {shop.shopid}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ShopSelector;
