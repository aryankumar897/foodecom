// app/dashboard/admin/product/edit/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductForm from "@/components/dashboard/admin/product/edit/ProductEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, updateProduct } from "@/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/slice/categorySlice";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    // Fetch categories first since product form needs them
    dispatch(fetchCategories());

    const fetchData = async () => {
      try {
        const data = await dispatch(fetchProductById(id)).unwrap();
        setProductData(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/dashboard/admin/product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateProduct({
          id,
          productData: {
            ...values,
            price: parseFloat(values.price),
            offer_price: values.offer_price ? parseFloat(values.offer_price) : null,
          },
        })
      ).unwrap();
      router.push("/dashboard/admin/product/list");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!productData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Product not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Product
      </Typography>
      <ProductForm
  initialValues={productData}
  categories={categories}
  onSubmit={handleSubmit}
  onCancel={() => router.push("/dashboard/admin/product/list")}
  loading={loading}
/>
    </Box>
  );
};

export default EditProductPage;