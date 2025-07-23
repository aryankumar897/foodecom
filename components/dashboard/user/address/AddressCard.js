import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton, 
  Box, 
  Chip,
  Divider,
Button

} from '@mui/material';
import { Edit, Delete, Phone, Email, LocationOn,CheckCircle } from '@mui/icons-material';
import { addressCardStyles } from './addressCardStyles';

const AddressCard = ({ address, onEdit, onDelete,



 onSelect,  // New prop for selection
  isSelected = false  // New prop to indicate selection state

 }) => {
  return (
    <Card
    
     sx={addressCardStyles.card}
    
  
    >

       {isSelected && (
        <CheckCircle 
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: '#4f46e5',
            fontSize: '2rem'
          }} 
        />
      )}

      <CardContent sx={addressCardStyles.cardContent}>
        <Box sx={addressCardStyles.nameContainer}>
          <Typography variant="h6" fontWeight="600">
            {address.first_name} {address.last_name}
          </Typography>
          <Chip 
            label={address.type} 
            color="primary" 
            size="small" 
            sx={addressCardStyles.typeChip}
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body2" sx={addressCardStyles.addressText}>
          <LocationOn color="action" fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          {address.address}
        </Typography>
        
        <Box sx={addressCardStyles.contactInfo}>
          <Typography variant="body2" sx={addressCardStyles.contactItem}>
            <Phone color="action" fontSize="small" />
            {address.phone}
          </Typography>
          <Typography variant="body2" sx={addressCardStyles.contactItem}>
            <Email color="action" fontSize="small" />
            {address.email}
          </Typography>
        </Box>
        
        {address.delivery_area_id && (
          <Box sx={addressCardStyles.deliveryInfo}>
            <Divider sx={{ mb: 1 }}>Delivery Information</Divider>
            <Typography variant="body2" sx={addressCardStyles.deliveryText}>
              <strong>Area:</strong> 
              <span>{address.delivery_area_id.area_name}</span>
            </Typography>
            <Typography variant="body2" sx={addressCardStyles.deliveryText}>
              <strong>Time:</strong> 
              <span>{address.delivery_area_id.min_delivery_time}-{address.delivery_area_id.max_delivery_time}</span>
            </Typography>
            <Typography variant="body2" sx={addressCardStyles.deliveryText}>
              <strong>Fee:</strong> 
              <span>${address.delivery_area_id.delivery_fee}</span>
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={addressCardStyles.cardActions}>



 {onSelect && (
          <Button
            variant={isSelected ? "contained" : "outlined"}
            onClick={() => onSelect(address)}
            sx={{ 
              mr: 1,
              ...(isSelected && {
                backgroundColor: '#4f46e5',
                '&:hover': { backgroundColor: '#4338ca' }
              })
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        )}



        <IconButton 
          aria-label="edit" 
          onClick={() => onEdit(address)}
          sx={addressCardStyles.actionButton}
        >
          <Edit color="primary" fontSize="small" />
        </IconButton>
        <IconButton 
          aria-label="delete" 
          onClick={() => onDelete(address)}
          sx={addressCardStyles.actionButton}
        >
          <Delete color="error" fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default AddressCard;