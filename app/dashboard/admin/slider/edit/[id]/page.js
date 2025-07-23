// app/dashboard/admin/slider/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import SliderForm from "@/components/dashboard/admin/slider/edit/SliderEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchSliderById, updateSlider } from "@/slice/sliderSlice";
import { useDispatch, useSelector } from "react-redux";

const EditSliderPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [sliderData, setSliderData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.sliders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchSliderById(id)).unwrap();
        setSliderData(data);
      } catch (error) {
        console.error("Failed to fetch slider:", error);
        router.push("/dashboard/admin/slider");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateSlider({
          id,
          sliderData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/slider/list");
    } catch (error) {
      console.error("Failed to update slider:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sliderData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Slider not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Slider
      </Typography>
      <SliderForm
        initialValues={sliderData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/slider/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditSliderPage;
