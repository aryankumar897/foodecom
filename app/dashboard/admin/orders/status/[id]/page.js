"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import OrderDetails from "@/components/dashboard/admin/orders/orderstatus/OrderStatus";

const ViewOrderPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/orders/status/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }

        // Format the data for frontend consumption
        const formattedData = {
          ...data.order,
          addressDetails: data.order.addressDetails,
          contactPhone: data.order.contactPhone,
          contactEmail: data.order.contactEmail,
          orderItems: data.orderItems
        };

        setOrderData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.push("/dashboard/admin/orders/allorders")}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!orderData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Order not found</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => router.push("/dashboard/admin/orders/allorders")}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return <OrderDetails order={orderData} />;
};

export default ViewOrderPage;