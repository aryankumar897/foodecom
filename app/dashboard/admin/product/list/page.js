// app/dashboard/products/page.jsx
"use client";
import ProductTable from "@/components/dashboard/admin/product/list/ProductTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchProducts } from "@/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/product/edit/${id}`);
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
          Products Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred"
            }
          }}
          onClick={() => router.push("/dashboard/admin/product/create")}
        >
          Add New Product
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default ProductsPage;