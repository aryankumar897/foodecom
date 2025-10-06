"use client";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useRef } from "react";
import PrintIcon from "@mui/icons-material/Print";
import {
  StyledContainer,
  StyledSidebar,
  ProductCell,
  OptionList,
  PriceHighlight,
  StatusBadge,
  SectionTitle,
  SummaryBox,
} from "./OrderDetailsstyles";
import InvoicePrint from "./InvoicePrint";

const OrderDetails = ({ order }) => {




  
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [orderStatus, setOrderStatus] = useState(order.order_status);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const invoiceRef = useRef();

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.API}/admin/orders/updatestatus/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          order_status: orderStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();
      setSnackbar({
        open: true,
        message: "Order status updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;

    const style = document.createElement("style");
    style.innerHTML = `
      @page { size: auto; margin: 10mm; }
      body { font-family: Arial; padding: 20px; }
    `;
    document.head.appendChild(style);

    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
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

  const getOrderStatusColor = (status) => {
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

  const formatAddress = () => {
    if (!order.addressDetails) return "Address not available";

    const addr = order.addressDetails;
    return `
      ${addr.first_name} ${addr.last_name || ""}
      ${addr.address}
      ${addr.deliveryArea?.name ? `Area: ${addr.deliveryArea.name}` : ""}
      Phone: ${order.contactPhone}
      Email: ${order.contactEmail}
    `;
  };

  const formatOptionPrice = (price) => (
    <PriceHighlight>+₹{price}</PriceHighlight>
  );







  return (
    <>
      <StyledContainer>
        {/* Order Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Order #{order.invoice_id}
          </Typography>
          {order.payment_approve_date && (
            <StatusBadge
              label={`Approved: ${new Date(
                order.payment_approve_date
              ).toLocaleDateString()}`}
              variant="outlined"
              color="success"
            />
          )}
        </Box>

        {/* Customer Information */}
        <Box mb={4}>
          <SectionTitle variant="h6">Customer Information</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Customer:</strong> {order.user_id?.name || "Guest"}
              </Typography>
              <Typography variant="body1" mt={1}>
                <strong>Payment Method:</strong>{" "}
                {order.payment_method || "Not specified"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Delivery Address:</Typography>
              <Typography variant="body1" whiteSpace="pre-line">
                {formatAddress()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Status Section */}
        <Box mb={4}>
          <SectionTitle variant="h6">Order Status</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StatusBadge
                label={`Payment Status: ${paymentStatus}`}
                color={getStatusColor(paymentStatus)}
              />
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
              <StatusBadge
                label={`Order Status: ${orderStatus}`}
                color={getOrderStatusColor(orderStatus)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Order Items */}
        <Box mb={4}>
          <SectionTitle variant="h6">Order Items</SectionTitle>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {order.orderItems?.length || 0} items in this order
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Variations</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems?.map((item, i) => (
                <TableRow key={i} hover>
                  <TableCell>{i + 1}</TableCell>
                  <ProductCell>
                    <Avatar
                      src={item.product_id?.thumb_image}
                      alt={item.product_name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography fontWeight="bold">
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        SKU: {item.product_id?.slug || "N/A"}
                      </Typography>
                    </Box>
                  </ProductCell>
                  <TableCell>
                    {item.product_size && (
                      <Box>
                        <Typography fontWeight="bold">
                          Size: {item.product_size.name || item.product_size}
                          {item.product_size.price &&
                            formatOptionPrice(item.product_size.price)}
                        </Typography>
                      </Box>
                    )}

                    {item.product_option &&
                      Array.isArray(item.product_option) && (
                        <Box mt={1}>
                          <Typography variant="body2" fontWeight="bold">
                            Options:
                          </Typography>
                          <OptionList>
                            {item.product_option.map((option, idx) => (
                              <li key={idx}>
                                <Typography variant="body2">
                                  {option.name}{" "}
                                  {formatOptionPrice(option.price)}
                                </Typography>
                              </li>
                            ))}
                          </OptionList>
                        </Box>
                      )}

                    {item.product_option &&
                      !Array.isArray(item.product_option) && (
                        <Box mt={1}>
                          <Typography variant="body2">
                            {item.product_option.name || item.product_option}
                            {item.product_option.price &&
                              formatOptionPrice(item.product_option.price)}
                          </Typography>
                        </Box>
                      )}
                  </TableCell>
                  <TableCell>₹{item.unit_price}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell fontWeight="bold">
                    ₹{(item.unit_price * item.qty).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Status Update */}
        <Box mb={4}>
          <SectionTitle variant="h6">Update Status</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" mb={1}>
                Payment Status
              </Typography>
              <Select
                fullWidth
                size="small"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" mb={1}>
                Order Status
              </Typography>
              <Select
                fullWidth
                size="small"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="inprocess">In Process</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleStatusUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </Box>

        {/* Order Summary */}
        <SummaryBox>
          <SectionTitle variant="h6">Order Summary</SectionTitle>
          <Box textAlign="right">
            <Typography variant="body1" mb={1}>
              Subtotal: ₹{order.subtotal}
            </Typography>
            <Typography variant="body1" mb={1}>
              Delivery Charge: ₹{order.delivery_charge}
            </Typography>
            <Typography variant="body1" mb={1}>
              Discount: ₹{order.discount}
            </Typography>
            <Typography variant="h6" mt={2} mb={3}>
              Grand Total: ₹{order.grand_total}
            </Typography>

            <InvoicePrint ref={invoiceRef} order={order} />

            <Button
              variant="contained"
              color="warning"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mt: 1 }}
            >
              Print Invoice
            </Button>
          </Box>
        </SummaryBox>
      </StyledContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderDetails;