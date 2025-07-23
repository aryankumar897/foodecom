// components/dashboard/admin/orders/orderstatus/OrderDetailsStyles.js
import { styled } from '@mui/material/styles';


import {
  Box,
  Typography,

  Chip,
 
  TableCell,
 
} from "@mui/material";
export const StyledContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

export const StyledSidebar = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
}));

export const ProductCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export const OptionList = styled('ul')(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  margin: 0,
  listStyleType: 'none',
  '& li': {
    padding: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&:before': {
      content: '"•"',
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1),
    }
  }
}));

export const PriceHighlight = styled('span')(({ theme }) => ({
  color: theme.palette.success.dark,
  fontWeight: 500,
  marginLeft: theme.spacing(0.5),
}));

export const StatusBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(1),
}));

export const SummaryBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(3),
}));