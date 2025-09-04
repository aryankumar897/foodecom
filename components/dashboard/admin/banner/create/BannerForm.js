"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ImageUpload from "@/utility/ProductImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createBanner } from "@/slice/bannerSlice";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./bannerFormStyles"; // create this file similar to testimonialFormStyles

const BannerForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.banners);

  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    banner: "",
    url: "",
    status: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const uploadImageToCloudinary = async () => {
    const cloudData = new FormData();
    cloudData.append("file", imageFile);
    cloudData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!imageFile) {
      setLocalError("Please upload a banner image");
      return;
    }

    if (!formData.title || !formData.sub_title || !formData.url) {
      setLocalError("Title, subtitle, and URL are required");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();

      const bannerData = {
        ...formData,
        banner: imageUrl,
      };

      await dispatch(createBanner(bannerData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        title: "",
        sub_title: "",
        banner: "",
        url: "",
        status: true,
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create banner");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Banner
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Banner created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            label="Banner Image"
          />

          <TextField
            fullWidth
            label="Title*"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Subtitle*"
            name="sub_title"
            value={formData.sub_title}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="URL*"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={handleSwitchChange}
                  name="status"
                  sx={switchStyles}
                />
              }
              label="Active Banner"
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size={isSmallScreen ? "medium" : "large"}
              disabled={loading}
              sx={submitButtonStyles}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creating..." : "Create Banner"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default BannerForm;
