"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { fetchDeliveryAreas } from "@/slice/deliveryAreaSlice"; // ✅ Fetch delivery areas
import DeliveryAreaTable from "@/components/dashboard/admin/delivery-area/list/DeliveryAreaTable"; // ✅ Table component

const DeliveryAreasPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { list: deliveryAreas, loading } = useSelector(
    (state) => state.deliveryAreas
  );

  useEffect(() => {
    dispatch(fetchDeliveryAreas());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/deliveryAreas/edit/${id}`);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Delivery Areas Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          onClick={() => router.push("/dashboard/admin/deliveryAreas/create")}
        >
          Add New Delivery Area
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <DeliveryAreaTable deliveryAreas={deliveryAreas} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default DeliveryAreasPage;
