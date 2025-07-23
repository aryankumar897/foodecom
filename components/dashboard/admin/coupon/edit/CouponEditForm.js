"use client";

import React, { useState } from "react";
import {
    Grid ,
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LocalOffer } from "@mui/icons-material";

const CouponForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
      code: "",
      quantity: 100,
      min_purchase_amount: 0,
      expire_date: "",
      discount_type: "percentage",
      discount: 10,
      status: true,
    }
  );

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.code) {
      setError("Name and code are required");
      return;
    }

    if (formData.discount_type === "percentage" && (formData.discount < 0 || formData.discount > 100)) {
      setError("Percentage discount must be between 0-100");
      return;
    }

    if (formData.discount_type === "fixed" && formData.discount < 0) {
      setError("Fixed discount must be positive");
      return;
    }

    if (!formData.expire_date || new Date(formData.expire_date) <= new Date()) {
      setError("Expiration date must be in the future");
      return;
    }

    try {
      await onSubmit({
        ...formData,
        code: formData.code.toUpperCase().trim(),
        expire_date: new Date(formData.expire_date).toISOString()
      });
    } catch (err) {
      setError(err.message || "Failed to save coupon");
      toast.error("Failed to save coupon");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        label="Coupon Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Coupon Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
        inputProps={{
          style: { textTransform: "uppercase" }
        }}
        helperText="Uppercase letters and numbers only"
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            margin="normal"
            size={isSmallScreen ? "small" : "medium"}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Minimum Purchase Amount"
            name="min_purchase_amount"
            type="number"
            value={formData.min_purchase_amount}
            onChange={handleChange}
            margin="normal"
            size={isSmallScreen ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: { min: 0, step: 0.01 }
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" size={isSmallScreen ? "small" : "medium"}>
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              label="Discount Type"
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed Amount</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={`Discount Value${formData.discount_type === "percentage" ? "%" : "($)"}`}
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            margin="normal"
            size={isSmallScreen ? "small" : "medium"}
            InputProps={{
              endAdornment: formData.discount_type === "percentage" ? (
                <InputAdornment position="end">%</InputAdornment>
              ) : (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: { 
                min: 0,
                max: formData.discount_type === "percentage" ? 100 : undefined
              }
            }}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        required
        label="Expiration Date"
        name="expire_date"
        type="datetime-local"
        value={formData.expire_date}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: new Date().toISOString().slice(0, 16)
        }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleToggleChange}
            name="status"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#4caf50",
                "&:hover": {
                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#4caf50",
              },
            }}
          />
        }
        label="Active Status"
        sx={{ my: 1 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LocalOffer />}
        >
          {loading ? "Saving..." : "Save Coupon"}
        </Button>
      </Box>
    </Box>
  );
};

export default CouponForm;