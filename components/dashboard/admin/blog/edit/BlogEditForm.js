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

const BlogForm = ({
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
    title: "",
    category_id: "",
    thumb_image: "",
    short_description: "",
    content: "",
   
    status: true, // publish
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  // Initialize form data when initialValues or categories change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        category_id:
          initialValues.category_id?._id || initialValues.category_id || "",
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

    if (!formData.title || !formData.category_id || !formData.content) {
      setError("Title, category and content are required");
      return;
    }

    try {
      let imageUrl = formData.thumb_image;

      if (imageFile) {
        const formDataObj = new FormData();
        formDataObj.append("file", imageFile);
        formDataObj.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formDataObj }
        );

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      await onSubmit({ ...formData, thumb_image: imageUrl });
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save blog");
      toast.error("Failed to save blog");
    }
  };

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
        label="Blog Thumbnail"
      />

      <TextField
        fullWidth
        required
        label="Blog Title"
        name="title"
        value={formData.title}
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
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={8}
        size={isSmallScreen ? "small" : "medium"}
      />

     

      <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={handleSwitchChange}
              name="status"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#ff0000",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.08)" },
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#ff0000",
                },
              }}
            />
          }
          label="Publish Blog"
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
            "&:hover": { backgroundColor: "darkred" },
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

export default BlogForm;
