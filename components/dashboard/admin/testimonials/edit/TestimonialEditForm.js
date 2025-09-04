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
  Rating,
} from "@mui/material";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Star as StarIcon } from "@mui/icons-material";

const TestimonialForm = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    image: "",
    review: "",
    rating: 5,
    show_at_home: false,
    status: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  // Initialize form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      setImagePreview(initialValues.image || "");
    }
  }, [initialValues]);

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

    if (!formData.name || !formData.title || !formData.review) {
      setError("Name, title, and review are required");
      return;
    }

    try {
      let imageUrl = formData.image;

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

      const testimonialData = {
        ...formData,
        image: imageUrl,
      };

      await onSubmit(testimonialData);
     
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save testimonial");
      toast.error("Failed to save testimonial");
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
        label="Testimonial Image"
      />

      <TextField
        fullWidth
        required
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Title/Position"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Review"
        name="review"
        value={formData.review}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        size={isSmallScreen ? "small" : "medium"}
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="rating"
          value={Number(formData.rating)}
          onChange={handleRatingChange}
          precision={0.5}
          size="large"
          icon={<StarIcon fontSize="inherit" />}
        />
      </Box>

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
          label="Active Testimonial"
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

export default TestimonialForm;