// components/dashboard/admin/product/sizes/ProductSizes.jsx
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
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  containerStyles,
  headerStyles,
  titleStyles,
  backButtonStyles,
  formContainerStyles,
  formTitleStyles,
  formRowStyles,
  textFieldStyles,
  addButtonStyles,
  tableContainerStyles,
  tableStyles,
  mobileTableCellStyles,
  deleteButtonStyles,
  dialogStyles,
} from "./productOptionsStyles";

const ProductSizes = () => {
  const { id: product_id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const fetchSizes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.API}/admin/product-options?product_id=${product_id}`);
      const data = await res.json();
      setSizes(data);
    } catch (err) {
      setError("Failed to load sizes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, [product_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSize = async () => {
    if (!formData.name || !formData.price) {
      setError("Size name and price are required");
      return;
    }

    try {
      setAdding(true);
      setError("");

      await fetch(`${process.env.API}/admin/product-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id,
          name: formData.name,
          price: parseFloat(formData.price),
        }),
      });

      toast.success("Size added successfully");
      setFormData({ name: "", price: "" });
      fetchSizes();
    } catch (err) {
      setError("Failed to add size");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSize = async () => {
    try {
      await fetch(`${process.env.API}/admin/product-options`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sizeToDelete }),
      });

      toast.success("Size deleted successfully");
      fetchSizes();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Failed to delete size");
    }
  };

  return (
    <Box sx={containerStyles}>
      {/* Header with Back Button */}
      <Box sx={headerStyles}>
        <IconButton 
          onClick={() => router.back()} 
          sx={backButtonStyles}
          aria-label="Go back"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={titleStyles}>
          Product Options
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for balance */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Add Size Form */}
      <Box sx={formContainerStyles}>
        <Typography variant="subtitle1" sx={formTitleStyles}>
          Add New Size
        </Typography>
        <Box sx={formRowStyles}>
          <TextField
            label="Size Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            size="small"
            sx={textFieldStyles}
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            size="small"
            sx={textFieldStyles}
            inputProps={{ min: 0, step: 0.01 }}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddSize}
            disabled={adding || !formData.name || !formData.price}
            startIcon={adding ? <CircularProgress size={20} /> : null}
            sx={addButtonStyles}
          >
            {adding ? "Adding..." : "Add Options"}
          </Button>
        </Box>
      </Box>

      {/* Sizes Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : sizes.length === 0 ? (
        <Typography>No sizes added yet</Typography>
      ) : (
        <TableContainer component={Paper} sx={tableContainerStyles}>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell sx={mobileTableCellStyles}>Size Name</TableCell>
                <TableCell sx={mobileTableCellStyles}>Price</TableCell>
                <TableCell align="right" sx={mobileTableCellStyles}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sizes.map((size) => (
                <TableRow key={size._id}>
                  <TableCell sx={mobileTableCellStyles}>{size.name}</TableCell>
                  <TableCell sx={mobileTableCellStyles}>
                    ${size.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={mobileTableCellStyles}>
                    <IconButton
                      onClick={() => {
                        setSizeToDelete(size._id);
                        setDeleteDialogOpen(true);
                      }}
                      sx={deleteButtonStyles}
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
        sx={dialogStyles}
      >
        <DialogTitle>Delete Size</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this size?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSize} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductSizes;