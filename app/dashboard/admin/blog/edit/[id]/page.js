"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BlogForm from "@/components/dashboard/admin/blog/edit/BlogEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchBlogById, updateBlog } from "@/slice/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/slice/categorySlice";

const EditBlogPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.blogs);
  const { list: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    // Fetch categories first since blog form needs them
    dispatch(fetchCategories());

    const fetchData = async () => {
      try {
        const data = await dispatch(fetchBlogById(id)).unwrap();
        setBlogData(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        router.push("/dashboard/admin/blog/list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateBlog({
          id,
          blogData: values, // blog form data
        })
      ).unwrap();
      router.push("/dashboard/admin/blog/list");
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blogData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Blog not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Blog
      </Typography>
      <BlogForm
        initialValues={blogData}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/blog/list")}
        loading={loading}
      />
    </Box>
  );
};

export default EditBlogPage;
