"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableCell,
  CircularProgress,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { StyledTableCell, StyledTableRow, ViewButton } from "./wishlistStyles";
import DeleteIcon from "@mui/icons-material/Delete";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${process.env.API}/user/wishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies with Next-Auth
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const data = await response.json();
      setWishlistItems(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${process.env.API}/user/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      // Remove the item from local state
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.product_id._id !== productId)
      );
      
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("Failed to remove item from wishlist");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Paper sx={{ mt: 3, p: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Wishlist is Empty
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Items added to your wishlist will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Wishlist ({wishlistItems.length} items)
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Product</StyledTableCell>
          
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wishlistItems.map((item, index) => (
            <StyledTableRow key={item._id || index}>
              <TableCell>{index + 1}</TableCell>
              
           
              <TableCell>
                {item.product_id?.price ? `$${item.product_id.price}` : "N/A"}
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <ViewButton 
                    size="small" 
                    onClick={() => window.location.href = `/product/${item.product_id?.slug}`}
                  >
                    View Product
                  </ViewButton>
                 
                </Box>
              </TableCell>
              <TableCell>
                 <IconButton
                    size="small"
                    onClick={() => handleRemoveFromWishlist(item.product_id._id)}
                    sx={{ color: "error.main" }}
                    aria-label="Remove from wishlist"
                  >
                    <DeleteIcon />
                  </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Wishlist;