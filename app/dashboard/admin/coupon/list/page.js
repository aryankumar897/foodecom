// app/dashboard/coupons/page.jsx
"use client";
import CouponTable from "@/components/dashboard/admin/coupon/list/CouponTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchCoupons } from "@/slice/couponSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const CouponsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: coupons, loading } = useSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/coupon/edit/${id}`);
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
          Coupons Management
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
          onClick={() => router.push("/dashboard/admin/coupon/create")}
        >
          Add New Coupon
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <CouponTable coupons={coupons} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default CouponsPage;
