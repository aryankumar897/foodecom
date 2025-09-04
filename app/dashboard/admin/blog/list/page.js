"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import BlogTable from "@/components/dashboard/admin/blog/list/BlogTable"; // ✅ Create a similar BlogTable component
import { fetchBlogs } from "@/slice/blogSlice"; // ✅ Blog slice

const BlogsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: blogs, loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/blog/edit/${id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Blogs Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
          onClick={() => router.push("/dashboard/admin/blog/create")}
        >
          Add New Blog
        </Button>
      </Box>

      {/* Blog Table */}
      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <BlogTable blogs={blogs} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default BlogsPage;
