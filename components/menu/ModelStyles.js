import { styled } from '@mui/material/styles';
import { Box, IconButton, Chip, FormControl, Button } from '@mui/material';

export const ModelContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
 // maxWidth: 485,
  width: '100%',
  height: '98vh',
 // maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    maxHeight: '100vh',
    borderRadius: 0,
  },
}));

export const ScrollableContent = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const FixedFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  color: theme.palette.text.secondary,
  zIndex: 1,
}));

export const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
  height: 500,
  [theme.breakpoints.down('sm')]: {
    height: 150,
  },
}));

export const CategoryTag = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  zIndex: 1,
}));

export const SizeFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
}));

export const QuantityBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3),
  padding: theme.spacing(1, 2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  padding: theme.spacing(1.5),
}));

export const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
  '&:hover': {
    borderColor: theme.palette.error.dark,
  },
}));

export const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));