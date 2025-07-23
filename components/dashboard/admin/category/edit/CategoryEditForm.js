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

const CategoryForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      name: "",
      slug: "",
      show_at_home: false,
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

    // Auto-generate slug when name changes
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
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

    if (!formData.name || !formData.slug) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save category");
      toast.error("Failed to save category");
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
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Slug"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
        helperText="URL-friendly version of the name"
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.show_at_home}
            onChange={handleToggleChange}
            name="show_at_home"
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
        label="Show at Homepage"
        sx={{ my: 1 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleToggleChange}
            name="status"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#ff0000",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.08)",
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#ff0000",
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
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;