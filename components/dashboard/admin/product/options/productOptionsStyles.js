// components/dashboard/admin/product/sizes/productSizesStyles.js
import { alpha } from "@mui/material/styles";

export const containerStyles = {
  p: 2,
};



export const formTitleStyles = {
  mb: 2,
  fontWeight: "medium",
};

export const formRowStyles = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 2,
  alignItems: { sm: "center" },
};

export const textFieldStyles = {
  flex: 1,
  "& .MuiInputBase-root": {
    height: { xs: "40px", sm: "auto" },
  },
};

export const addButtonStyles = {
  mt: { xs: 1, sm: 0 },
  alignSelf: { xs: "flex-start", sm: "center" },
};

export const tableContainerStyles = {
  overflowX: "auto",
};

export const tableStyles = {
  minWidth: 300,
};

export const mobileTableCellStyles = {
  px: 1,
  py: 1.5,
};

export const deleteButtonStyles = {
  color: "error.main",
  "&:hover": {
    backgroundColor: alpha("#ff0000", 0.08),
  },
};

export const dialogStyles = {
  "& .MuiPaper-root": {
    width: { xs: "90%", sm: "auto" },
    maxWidth: "400px",
  },
};

export const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3,
};

export const titleStyles = {
  fontWeight: "bold",
};

export const backButtonStyles = {
  color: "text.primary",
  "&:hover": {
    backgroundColor: alpha("#000000", 0.08),
  },
};

export const formContainerStyles = {
  mb: 4,
  p: 2,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  backgroundColor: "background.paper",
};