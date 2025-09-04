"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ChefForm from "@/components/dashboard/admin/chef/edit/ChefEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchChefById, updateChef } from "@/slice/chefSlice";
import { useDispatch, useSelector } from "react-redux";

const EditChefPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [chefData, setChefData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.chefs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchChefById(id)).unwrap();
        setChefData(data);
      } catch (error) {
        console.error("Failed to fetch chef:", error);
        router.push("/dashboard/admin/chef");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateChef({
          id,
          chefData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/chefs/list");
    } catch (error) {
      console.error("Failed to update chef:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chefData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Chef not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Chef
      </Typography>
      <ChefForm
        initialValues={chefData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/chefs/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditChefPage;