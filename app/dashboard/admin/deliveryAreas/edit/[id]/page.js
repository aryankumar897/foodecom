"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import DeliveryAreaForm from "@/components/dashboard/admin/delivery-area/edit/DeliveryAreaEditForm"; // ✅ your form
import { useParams, useRouter } from "next/navigation";
import { fetchDeliveryAreaById, updateDeliveryArea } from "@/slice/deliveryAreaSlice"; // ✅ slice actions
import { useDispatch, useSelector } from "react-redux";

const EditDeliveryAreaPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [areaData, setAreaData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.deliveryAreas);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchDeliveryAreaById(id)).unwrap();
        setAreaData(data);
      } catch (error) {
        console.error("Failed to fetch delivery area:", error);
        router.push("/dashboard/admin/delivery-area");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateDeliveryArea({
          id,
          areaData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/deliveryAreas/list");
    } catch (error) {
      console.error("Failed to update delivery area:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!areaData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Delivery area not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Delivery Area
      </Typography>
      <DeliveryAreaForm
        initialValues={areaData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/deliveryAreas/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditDeliveryAreaPage;
