"use client";
import BannerTable from "@/components/dashboard/admin/banner/list/BannerTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchBanners } from "@/slice/bannerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const BannersPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: banners, loading } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/banner/edit/${id}`);
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
          Banners Management
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
          onClick={() => router.push("/dashboard/admin/banner/create")}
        >
          Add New Banner
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <BannerTable banners={banners} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default BannersPage;
