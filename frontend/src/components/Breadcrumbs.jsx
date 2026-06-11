import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Breadcrumbs({ items }) {
  const navigate = useNavigate();

  return (
    <MuiBreadcrumbs sx={{ mb: 2, color: "text.secondary", fontSize: 14 }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
          return (
            <Typography key={item.label} color="text.primary" fontSize={14}>
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={item.label}
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer", fontSize: 14 }}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;
