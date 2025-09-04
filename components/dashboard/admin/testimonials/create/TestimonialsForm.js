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
  Rating,
} from "@mui/material";
import ImageUpload from "@/utility/ProductImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonial } from "@/slice/testimonialSlice";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./testimonialFormStyles";

const TestimonialForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.testimonials);

  const [formData, setFormData] = useState({
    image: "",
    name: "",
    title: "",
    review: "",
    rating: 5,
    show_at_home: false,
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

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    try {
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
      setLocalError("Please upload a testimonial image");
      return;
    }

    if (!formData.name || !formData.title || !formData.review) {
      setLocalError("Name, title, and review are required");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();

      const testimonialData = {
        ...formData,
        image: imageUrl,
      };

      await dispatch(createTestimonial(testimonialData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        image: "",
        name: "",
        title: "",
        review: "",
        rating: 5,
        show_at_home: false,
        status: true,
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create testimonial");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Testimonial
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Testimonial created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            label="Testimonial Image"
          />

          <TextField
            fullWidth
            label="Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Title/Position*"
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
            label="Review*"
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            multiline
            rows={4}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={Number(formData.rating)}
              onChange={handleRatingChange}
              precision={0.5}
              size="large"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.show_at_home}
                  onChange={handleSwitchChange}
                  name="show_at_home"
                  sx={switchStyles}
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
                  sx={switchStyles}
                />
              }
              label="Active Testimonial"
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
              {loading ? "Creating..." : "Create Testimonial"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default TestimonialForm;