import { FormControl, InputLabel, MenuItem, Select, CircularProgress, Box } from "@mui/material";

function ProductSelector({ products, value, onChange, loading, disabled }) {
  return (
    <FormControl fullWidth disabled={disabled || loading}>
      <InputLabel id="product-select-label">Sản phẩm</InputLabel>
      <Select
        labelId="product-select-label"
        label="Sản phẩm"
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
        {products.map((product) => (
          <MenuItem key={product.itemid} value={String(product.itemid)}>
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ProductSelector;
