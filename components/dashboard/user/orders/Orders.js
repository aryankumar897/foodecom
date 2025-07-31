"use client";
import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, Paper, Box, useMediaQuery, Dialog, DialogContent,
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InvoiceDetails from "./InvoiceDetails";

const OrderList = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.API}/user/orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bgcolor: '#ffedd5', color: '#9a3412' };
      case 'completed':
      case 'paid':
        return { bgcolor: '#dcfce7', color: '#166534' };
      case 'cancelled':
        return { bgcolor: '#fee2e2', color: '#991b1b' };
      default:
        return { bgcolor: '#e0e7ff', color: '#3730a3' };
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box p={2}>
        <Typography>No orders found</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Order List
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="order table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f97316" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Typography fontWeight="bold">{order.invoice_id}</Typography>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: getStatusColor(order.order_status).bgcolor,
                      color: getStatusColor(order.order_status).color,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                      display: "inline-block",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {order.order_status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {order.currency_name?.toUpperCase()} {order.grand_total}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen(order)}
                    sx={{
                      backgroundColor: "#f97316",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#fb923c" },
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          {selectedOrder && <InvoiceDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderList;