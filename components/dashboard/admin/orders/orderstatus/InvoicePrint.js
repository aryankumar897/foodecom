// components/dashboard/admin/orders/InvoicePrint.jsx
"use client";
import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';

const InvoicePrint = React.forwardRef(({ order }, ref) => {
  const formatAddress = () => {
    if (!order.addressDetails) return "Address not available";
    const addr = order.addressDetails;
    return `
      ${addr.first_name} ${addr.last_name || ''}
      ${addr.address}
      ${addr.deliveryArea?.name ? `Area: ${addr.deliveryArea.name}` : ''}
      Phone: ${order.contactPhone}
      Email: ${order.contactEmail}
    `;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'inprocess': return 'info';
      case 'failed': 
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box ref={ref} sx={{ 
      p: 4, 
      maxWidth: 800, 
      margin: '0 auto', 
      display: 'none',
      '@media print': {
        display: 'block',
        backgroundColor: 'white'
      }
    }}>
      {/* Header with colorful accent */}
      <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        p: 3,
        mb: 4,
        borderRadius: 1,
        boxShadow: 2
      }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
          INVOICE
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="body1">
            <strong>Order #:</strong> {order.invoice_id}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Customer and Shop Info */}
      <Box display="flex" justifyContent="space-between" mb={4} gap={3}>
        <Box sx={{
          p: 3,
          borderLeft: '4px solid',
          borderColor: 'secondary.main',
          backgroundColor: 'grey.50',
          borderRadius: 1,
          flex: 1
        }}>
          <Typography variant="h6" fontWeight="bold" color="secondary.main" gutterBottom>
            BILL TO
          </Typography>
          <Typography whiteSpace="pre-line" sx={{ lineHeight: 1.6 }}>
            {formatAddress()}
          </Typography>
        </Box>
        
        <Box sx={{
          p: 3,
          borderLeft: '4px solid',
          borderColor: 'info.main',
          backgroundColor: 'grey.50',
          borderRadius: 1,
          flex: 1,
          textAlign: 'right'
        }}>
          <Typography variant="h6" fontWeight="bold" color="info.main" gutterBottom>
            SHOP INFO
          </Typography>
          <Typography sx={{ lineHeight: 1.6 }}>
            <strong>Your Shop Name</strong><br />
            Shop Address Line 1<br />
            City, State, ZIP<br />
            Phone: (123) 456-7890<br />
            Email: shop@example.com
          </Typography>
        </Box>
      </Box>

      {/* Status Indicators */}
      <Box display="flex" gap={2} mb={4} justifyContent="center">
        <Chip 
          label={`Payment: ${order.payment_status.toUpperCase()}`} 
          color={getStatusColor(order.payment_status)}
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 2,
            py: 1
          }}
        />
        <Chip 
          label={`Order: ${order.order_status.toUpperCase()}`} 
          color={getStatusColor(order.order_status)}
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 2,
            py: 1
          }}
        />
        {order.payment_approve_date && (
          <Chip
            label={`Paid: ${new Date(order.payment_approve_date).toLocaleDateString()}`}
            color="success"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.9rem',
              px: 2,
              py: 1
            }}
          />
        )}
      </Box>

      {/* Order Items */}
      <Box mb={4} sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden'
      }}>
        <Box sx={{
          backgroundColor: 'primary.light',
          p: 2,
          color: 'primary.contrastText'
        }}>
          <Typography variant="h6" fontWeight="bold">
            ORDER ITEMS
          </Typography>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {order.orderItems?.map((item, i) => (
            <Box key={i} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: i < order.orderItems.length - 1 ? '1px dashed' : 'none',
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 2, gap: 2 }}>
                <Box sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {item.product_id?.thumb_image ? (
                    <img 
                      src={item.product_id.thumb_image} 
                      alt={item.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography color="text.secondary">No Image</Typography>
                  )}
                </Box>
                <Box>
                  <Typography fontWeight="bold">{item.product_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {item.product_id?.slug || 'N/A'}
                  </Typography>
                  {item.product_size && (
                    <Typography variant="body2">
                      <Box component="span" sx={{ color: 'primary.main' }}>Size:</Box> {item.product_size.name || item.product_size}
                      {item.product_size.price && (
                        <Box component="span" sx={{ color: 'success.main', ml: 1 }}>
                          (+₹{item.product_size.price})
                        </Box>
                      )}
                    </Typography>
                  )}
                  {item.product_option && Array.isArray(item.product_option) && (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2">
                        <Box component="span" sx={{ color: 'primary.main' }}>Options:</Box>
                      </Typography>
                      {item.product_option.map((opt, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 1.5 }}>
                          • {opt.name} <Box component="span" sx={{ color: 'success.main' }}>(+₹{opt.price})</Box>
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography>₹{item.unit_price} × {item.qty}</Typography>
              </Box>
              
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography fontWeight="bold" color="primary.main">
                  ₹{(item.unit_price * item.qty).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Order Summary */}
      <Box sx={{
        backgroundColor: 'grey.50',
        p: 3,
        borderRadius: 1,
        borderLeft: '4px solid',
        borderColor: 'primary.main'
      }}>
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
          ORDER SUMMARY
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          mb: 2
        }}>
          <Typography>Subtotal:</Typography>
          <Typography textAlign="right">₹{order.subtotal}</Typography>
          
          <Typography>Delivery Charge:</Typography>
          <Typography textAlign="right">₹{order.delivery_charge}</Typography>
          
          <Typography>Discount:</Typography>
          <Typography textAlign="right" color="error.main">-₹{order.discount}</Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h5" fontWeight="bold">
            GRAND TOTAL
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            ₹{order.grand_total}
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box mt={4} textAlign="center" sx={{
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary">
          Thank you for your business! ❤️
        </Typography>
        <Typography variant="caption" display="block" mt={1} color="text.secondary">
          For any inquiries, please contact support@example.com
        </Typography>
      </Box>
    </Box>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;