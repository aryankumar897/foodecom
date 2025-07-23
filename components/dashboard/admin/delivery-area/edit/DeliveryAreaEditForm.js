"use client";

import React, { useState } from "react";
import {
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeliveryAreaForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      area_name: "",
      delivery_fee: "",
      min_delivery_time: "",
      max_delivery_time: "",
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

    const { area_name, delivery_fee, min_delivery_time, max_delivery_time } = formData;
    if (!area_name || !delivery_fee || !min_delivery_time || !max_delivery_time) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save delivery area");
      toast.error("Failed to save delivery area");
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
       
      <Typography variant="h5" sx={{ mb: 3 }}>
        {initialValues ? "Edit Delivery Area" : "Add New Delivery Area"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        label="Area Name"
        name="area_name"
        value={formData.area_name}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        type="number"
        label="Delivery Fee ($)"
        name="delivery_fee"
        value={formData.delivery_fee}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        type="number"
        label="Min Delivery Time (mins)"
        name="min_delivery_time"
        value={formData.min_delivery_time}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        type="number"
        label="Max Delivery Time (mins)"
        name="max_delivery_time"
        value={formData.max_delivery_time}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleToggleChange}
            name="status"
          />
        }
        label="Active Status"
        sx={{ my: 2 }}
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
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Delivery Area"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeliveryAreaForm;
