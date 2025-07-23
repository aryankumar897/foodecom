// styles.js
import { styled } from "@mui/material";
import { Tabs, Box, Avatar } from "@mui/material";

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '120px',
  height: '120px',
  margin: '0 auto 15px',
  border: '3px solid    #FF6B6B',
  borderRadius: '50%',
  [theme.breakpoints.up('sm')]: {
    width: '160px',
    height: '160px',
  },
}));

export const StyledDivider = styled("div")(({ theme }) => ({
  width: '70%',
  height: '2px',
  margin: '0 auto 20px',
  background: 'linear-gradient(90deg, transparent,rgb(252, 247, 247), transparent)',
  [theme.breakpoints.up('sm')]: {
    marginBottom: '25px',
  },
}));

export const Root = styled("div")(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'auto',
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    minHeight: '600px',
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: '100%',
  maxHeight: '60px',
  overflowX: 'auto',
  overflowY: 'hidden',
  backgroundColor: '#fff',
  borderBottom: '1px solid #f1f2f6',
  '& .MuiTabs-scroller': {
    display: 'flex',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#FF6B6B',
    height: '3px',
  },
  '& .MuiTab-root': {
    minWidth: '100px',
    minHeight: '60px',
    padding: '8px 12px',
    fontSize: '13px',
    '& svg': {
      marginBottom: '4px',
    },
  },
  [theme.breakpoints.up('sm')]: {
    width: '280px',
    minWidth: '280px',
    maxHeight: 'none',
    overflow: 'visible',
    borderBottom: 'none',
    borderRight: '1px solid #f1f2f6',
    padding: '30px 0',
    '& .MuiTabs-indicator': {
      width: '3px',
      height: 'auto',
    },
    '& .MuiTab-root': {
      minWidth: 'auto',
      minHeight: '48px',
      padding: '12px 30px',
      fontSize: '15px',
      '& svg': {
        marginBottom: '0',
      },
    },
  },
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '20px',
  [theme.breakpoints.up('sm')]: {
    padding: '35px 40px',
  },
}));

export const TabIconContainer = styled("div")(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  '& svg': {
    fontSize: '20px',
    color: 'red',
  },
  '&.Mui-selected svg': {
    color: 'red',
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: '14px',
    '& svg': {
      fontSize: '28px',
    },
  },
}));