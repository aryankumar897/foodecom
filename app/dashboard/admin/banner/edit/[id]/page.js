"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BannerForm from "@/components/dashboard/admin/banner/edit/BannerEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchBannerById, updateBanner } from "@/slice/bannerSlice";
import { useDispatch, useSelector } from "react-redux";

const EditBannerPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.banners);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchBannerById(id)).unwrap();
        setBannerData(data);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
        router.push("/dashboard/admin/banner");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateBanner({
          id,
          bannerData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/banner/list");
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bannerData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Banner not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Banner
      </Typography>
      <BannerForm
        initialValues={bannerData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/banner/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditBannerPage;
