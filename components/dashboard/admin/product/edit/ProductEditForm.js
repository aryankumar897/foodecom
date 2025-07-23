// components/dashboard/admin/product/ProductForm.jsx
"use client";

import React, { useState, useEffect } from "react";
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
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ProductForm = ({
  initialValues,
  categories,
  onSubmit,
  onCancel,
  loading,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    offer_price: "",
    thumb_image: "",
    short_description: "",
    long_description: "",
    sku: "",
    seo_title: "",
    seo_description: "",
    show_at_home: false,
    status: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  // Initialize form data when initialValues or categories change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        // Convert category_id object to just the ID string if needed
        category_id:
          initialValues.category_id?._id || initialValues.category_id || "",
        price: initialValues.price?.toString() || "",
        offer_price: initialValues.offer_price?.toString() || "",
      });
      setImagePreview(initialValues.thumb_image || "");
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    setImageFile(file);

    if (file instanceof File || file instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.category_id || !formData.price) {
      setError("Name, category and price are required");
      return;
    }

    try {
      let imageUrl = formData.thumb_image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      const productData = {
        ...formData,
        thumb_image: imageUrl,
        price: parseFloat(formData.price),
        offer_price: formData.offer_price
          ? parseFloat(formData.offer_price)
          : null,
      };

      await onSubmit(productData);
     
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save product");
      toast.error("Failed to save product");
    }
  };

  // Find the current category for display
  const currentCategory = categories?.find(
    (cat) => cat._id === formData.category_id
  );

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

      <ImageUpload
        imagePreview={imagePreview}
        onChange={handleImageChange}
        label="Product Thumbnail"
      />

      <TextField
        fullWidth
        required
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Category</InputLabel>
        <Select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          label="Category"
          size={isSmallScreen ? "small" : "medium"}
        >
          {categories?.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {currentCategory && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: "block", color: "text.secondary" }}
          >
            Current: {currentCategory.name}
          </Typography>
        )}
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          required
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          size={isSmallScreen ? "small" : "medium"}
          inputProps={{ min: 0, step: 0.01 }}
        />
        <TextField
          fullWidth
          label="Offer Price"
          name="offer_price"
          type="number"
          value={formData.offer_price || ""}
          onChange={handleChange}
          margin="normal"
          size={isSmallScreen ? "small" : "medium"}
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Box>

      <TextField
        fullWidth
        label="SKU"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="Short Description"
        name="short_description"
        value={formData.short_description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="Long Description"
        name="long_description"
        value={formData.long_description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={5}
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="SEO Title"
        name="seo_title"
        value={formData.seo_title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="SEO Description"
        name="seo_description"
        value={formData.seo_description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
        size={isSmallScreen ? "small" : "medium"}
      />

      <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.show_at_home}
              onChange={handleSwitchChange}
              name="show_at_home"
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
          label="Show at Home"
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={handleSwitchChange}
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
          label="Active Product"
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            minWidth: 100,
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
