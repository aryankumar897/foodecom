// components/dashboard/admin/daily-offers/DailyOffers.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DailyOffers = () => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch daily offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.API}/admin/dailyOffer`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
         console.log("error  fetch offer"  ,error)
      setError("Failed to load daily offers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for autocomplete
  const fetchProducts = async (search = "") => {
    try {
      const res = await fetch(
        `${process.env.API}/admin/search/products${
          search ? `?search=${search}` : ""
        }`
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  // Search products when user types
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchProducts(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddOffer = async () => {
    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    try {
      setAdding(true);
      setError("");

      await fetch(`${process.env.API}/admin/dailyOffer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct._id,
          status: true,
        }),
      });

      toast.success("Product added to daily offers successfully");
      setSelectedProduct(null);
      setSearchTerm("");
      fetchOffers();
    } catch (err) {
      setError("Failed to add product to daily offers");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      await fetch(`${process.env.API}/admin/dailyOffer/${offerToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offerToDelete }),
      });

      toast.success("Offer deleted successfully");
      fetchOffers();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Failed to delete offer");
    }
  };

  const toggleOfferStatus = async (id, currentStatus) => {
    try {
      await fetch(`${process.env.API}/admin/dailyOffer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: !currentStatus,
        }),
      });

      toast.success("Offer status updated successfully");
      fetchOffers();
    } catch (err) {
      setError("Failed to update offer status");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{ mr: 2 }}
          aria-label="Go back"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">Daily Offers</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Add Offer Form */}
      <Box sx={{ mb: 4, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Add Product to Daily Offers
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 2,
          }}
        >
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name || ""}
            value={selectedProduct}
            onChange={(event, newValue) => {
              setSelectedProduct(newValue);
            }}
            inputValue={searchTerm}
            onInputChange={(event, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
              fullWidth
                {...params}
                label="Search Products"
                variant="outlined"
                size="small"
                sx={{ minWidth: 250 }}
              />
            )}
            fullWidth={isSmallScreen}
          />
          <Button
            variant="contained"
            onClick={handleAddOffer}
            disabled={adding || !selectedProduct}
            startIcon={adding ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 150 }}
          >
            {adding ? "Adding..." : "Add Offer"}
          </Button>
        </Box>
      </Box>

      {/* Offers Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : offers.length === 0 ? (
        <Typography>No products in daily offers yet</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer._id}>
                  <TableCell>
                    {offer.product_id?.name || "Unknown Product"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={offer.status ? "contained" : "outlined"}
                      color={offer.status ? "success" : "error"}
                      size="small"
                      onClick={() => toggleOfferStatus(offer._id, offer.status)}
                    >
                      {offer.status ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setOfferToDelete(offer._id);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                      size={isSmallScreen ? "small" : "medium"}
                    >
                      <Delete fontSize={isSmallScreen ? "small" : "medium"} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Offer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this product from daily offers?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteOffer} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyOffers;
