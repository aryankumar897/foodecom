export const addressStyles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
       fontWeight: '900'
  },
  addButton: {
    backgroundColor:"red",
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: 'red'
    },
    '@media (max-width: 600px)': {
      width: '100%',
      marginTop: '10px',
       backgroundColor:"red",
    }
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr'
    }
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1
  },
  cardActions: {
    justifyContent: 'flex-end'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },
  deleteText: {
    marginBottom: '20px'
  },
  deliveryInfo: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px'
  },
  deliveryText: {
    fontSize: '0.875rem',
    color: 'text.secondary'
  },
  selectEmpty: {
    marginTop: '16px'
  }
};