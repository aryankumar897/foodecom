// app/dashboard/testimonials/page.jsx
"use client";
import TestimonialTable from "@/components/dashboard/admin/testimonials/list/TestimonialTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchTestimonials } from "@/slice/testimonialSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const TestimonialsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: testimonials, loading } = useSelector((state) => state.testimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/testimonials/edit/${id}`);
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
          Testimonials Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred"
            }
          }}
          onClick={() => router.push("/dashboard/admin/testimonials/create")}
        >
          Add New Testimonial
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <TestimonialTable
          testimonials={testimonials}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default TestimonialsPage;