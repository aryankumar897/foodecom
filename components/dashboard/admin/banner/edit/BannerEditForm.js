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
} from "@mui/material";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BannerForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    banner: "",
    url: "",
    status: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  // Initialize form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      setImagePreview(initialValues.banner || "");
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.sub_title || !formData.url) {
      setError("Title, subtitle, and URL are required");
      return;
    }

    try {
      let bannerUrl = formData.banner;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: uploadData }
        );

        if (!response.ok) {
          throw new Error("Failed to upload banner image");
        }

        const data = await response.json();
        bannerUrl = data.secure_url;
      }

      await onSubmit({ ...formData, banner: bannerUrl });
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save banner");
      toast.error("Failed to save banner");
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

      <ImageUpload
        imagePreview={imagePreview}
        onChange={handleImageChange}
        label="Banner Image"
      />

      <TextField
        fullWidth
        required
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Subtitle"
        name="sub_title"
        value={formData.sub_title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="URL"
        name="url"
        value={formData.url}
        onChange={handleChange}
        margin="normal"
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
          label="Active Banner"
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ minWidth: 100 }}>
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

export default BannerForm;
