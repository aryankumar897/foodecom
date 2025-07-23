// app/dashboard/admin/category/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CategoryForm from "@/components/dashboard/admin/category/edit/CategoryEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchCategoryById, updateCategory } from "@/slice/categorySlice";
import { useDispatch, useSelector } from "react-redux";

const EditCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchCategoryById(id)).unwrap();
        setCategoryData(data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        router.push("/dashboard/admin/category");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateCategory({
          id,
          categoryData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/category/list");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!categoryData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Category not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Category
      </Typography>
      <CategoryForm
        initialValues={categoryData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/category/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditCategoryPage;