
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import TestimonialForm from "@/components/dashboard/admin/testimonials/edit/TestimonialEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchTestimonialById, updateTestimonial } from "@/slice/testimonialSlice";
import { useDispatch, useSelector } from "react-redux";

const EditTestimonialPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [testimonialData, setTestimonialData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.testimonials);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchTestimonialById(id)).unwrap();
        setTestimonialData(data);
      } catch (error) {
        console.error("Failed to fetch testimonial:", error);
        router.push("/dashboard/admin/testimonials/list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateTestimonial({
          id,
          testimonialData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/testimonials/list");
    } catch (error) {
      console.error("Failed to update testimonial:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!testimonialData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Testimonial not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Testimonial
      </Typography>
      <TestimonialForm
        initialValues={testimonialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/testimonials/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditTestimonialPage;