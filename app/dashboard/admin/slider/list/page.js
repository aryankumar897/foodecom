// app/dashboard/sliders/page.jsx
"use client";
import SliderTable from "@/components/dashboard/admin/slider/list/SliderTable";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchSliders } from "@/slice/sliderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SlidersPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: sliders, loading } = useSelector((state) => state.sliders);

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

 

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/slider/edit/${id}`);
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
          Sliders Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color:"white",
            backgroundColor:"red",
            "&:hover":{
              backgroundColor:"darkred"
            }
          }}
          onClick={() => router.push("/dashboard/admin/slider/create")}
        >
          Add New Slider
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <SliderTable
          sliders={sliders}
      
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default SlidersPage;
