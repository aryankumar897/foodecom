"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import {
  tableContainerStyles,
  tableStyles,
  responsiveCellStyles,
  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./ordersTableStyles";
 
import { useRouter } from 'next/navigation'
const OrderTable = () => {

const router=useRouter()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/orders/delivered`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/orders/allorders/${orderToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderToDelete));
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete order");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleViewOrder = (orderId) => {
    // Implement view order functionality
    router.push(`/dashboard/admin/orders/status/${orderId}`)
    console.log("View order:", orderId);
    // You might navigate to a detailed view or open a modal
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "inprocess":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "paid":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginatedOrders = orders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedOrders.map((order) => (
          <Box key={order._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Invoice ID</Typography>
              <Typography>{order.invoice_id}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>User</Typography>
              <Typography>
                {order.user_id?.name || "Unknown User"}
              </Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Qty</Typography>
              <Typography>{order.product_qty}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Total</Typography>
              <Typography>₹{order.grand_total}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Order Status</Typography>
              <Chip
                label={order.order_status}
                color={getStatusColor(order.order_status)}
                size="small"
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Payment</Typography>
              <Chip
                label={order.payment_status}
                color={getPaymentStatusColor(order.payment_status)}
                size="small"
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Date</Typography>
              <Typography>{formatDate(order.createdAt)}</Typography>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => handleViewOrder(order._id)}
                sx={actionButtonStyles}
                color="primary"
              >
                <ViewIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(order._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(orders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice Id</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Product Qty</TableCell>
              <TableCell>Grand Total</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.invoice_id}</TableCell>
                <TableCell>
                  {order.user_id?.name || "Unknown User"}
                </TableCell>
                <TableCell>{order.product_qty}</TableCell>
                <TableCell>₹{order.grand_total}</TableCell>
                <TableCell>
                  <Chip
                    label={order.order_status}
                    color={getStatusColor(order.order_status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.payment_status}
                    color={getPaymentStatusColor(order.payment_status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewOrder(order._id)}
                    sx={actionButtonStyles}
                    color="primary"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(order._id)}
                    sx={{ ...actionButtonStyles, color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(orders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderTable;