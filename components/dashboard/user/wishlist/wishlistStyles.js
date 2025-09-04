// styles/wishlistStyles.js
import { styled } from "@mui/material/styles";
import { TableCell, TableRow, Button } from "@mui/material";

// Table header cells
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#f93016ff", // orange header
  color: "white",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    padding: "6px",
  },
}));

// Table body rows
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.down("sm")]: {
    "& td": {
      fontSize: "12px",
      padding: "6px",
    },
  },
}));

// Button style
export const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f91616ff",
  color: "white",
  textTransform: "none",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#ea0c0cff",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    padding: "4px 8px",
  },
}));
