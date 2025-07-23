// components/dashboard/sliders/sliderTableStyles.js
export const tableContainerStyles = {
  width: '100%',
  overflowX: 'auto',
  mt: 3,
  p: 1,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 1
};

export const tableStyles = {
  minWidth: 650,
  '& .MuiTableCell-root': {
    py: 1.5,
    fontSize: { xs: '0.75rem', sm: '0.875rem' }
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: 'background.default'
  }
};

export const responsiveCellStyles = {
  display: { xs: 'none', sm: 'table-cell' }
};

export const imageCellStyles = {
  width: 100,
  '& img': {
    width: 80,
    height: 45,
    objectFit: 'cover',
    borderRadius: 1
  }
};

export const statusStyles = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',
  px: 1,
  borderRadius: 1,
  backgroundColor: status ? 'success.light' : 'error.light',
  color: status ? 'success.dark' : 'error.dark',
  fontSize: '0.75rem',
  fontWeight: 'bold'
});

export const paginationStyles = {
  '& .MuiPaginationItem-root': {
    fontSize: { xs: '0.75rem', sm: '0.875rem' }
  },
  '& .MuiPagination-ul': {
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};

export const actionButtonStyles = {
  minWidth: 30,
  padding: { xs: '6px', sm: '8px' },
  '& + &': {
    ml: 0.5
  }
};

export const mobileRowStyles = {
  display: { xs: 'flex', sm: 'table-row' },
  flexDirection: 'column',
  p: 2,
  mb: 2,
  borderRadius: 1,
  bgcolor: 'background.paper',
  boxShadow: 1
};

export const mobileCellStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  p: '8px 0',
  borderBottom: '1px solid',
  borderColor: 'divider',
  '&:last-child': {
    borderBottom: 'none'
  }
};

export const mobileLabelStyles = {
  fontWeight: 'bold',
  mr: 2,
  minWidth: 100
};
