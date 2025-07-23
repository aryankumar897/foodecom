export const addressCardStyles = {
  card: {
    maxWidth: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
    }
  },
  cardContent: {
    padding: '24px',
    '&:last-child': {
      paddingBottom: '24px'
    }
  },
  cardActions: {
    padding: '0 16px 16px',
    justifyContent: 'flex-end',
    gap: '8px'
  },
  nameContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  typeChip: {
    borderRadius: '6px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  addressText: {
    color: '#555',
    marginBottom: '12px',
    lineHeight: '1.6'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem'
  },
  deliveryInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '16px'
  },
  deliveryText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem',
    marginBottom: '4px',
    '& strong': {
      color: '#333',
      fontWeight: '600'
    }
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)'
    }
  }
};