// app/dashboard/admin/coupon/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CouponForm from "@/components/dashboard/admin/coupon/edit/CouponEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchCouponById, updateCoupon } from "@/slice/couponSlice";
import { useDispatch, useSelector } from "react-redux";

const EditCouponPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [couponData, setCouponData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.coupons);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchCouponById(id)).unwrap();
        // Format date for the date picker input
        const formattedData = {
          ...data,
          expire_date: new Date(data.expire_date).toISOString().slice(0, 16),
        };
        setCouponData(formattedData);
      } catch (error) {
        console.error("Failed to fetch coupon:", error);
        router.push("/dashboard/admin/coupon");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateCoupon({
          id,
          couponData: {
            ...values,
            // Convert back to proper date format for the server
            expire_date: new Date(values.expire_date).toISOString(),
          },
        })
      ).unwrap();
      router.push("/dashboard/admin/coupon/list");
    } catch (error) {
      console.error("Failed to update coupon:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!couponData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Coupon not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Coupon
      </Typography>
      <CouponForm
        initialValues={couponData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/coupon/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditCouponPage;
