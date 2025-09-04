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
import { createChef } from "@/slice/chefSlice";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./chefsFormStyles";

const ChefForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chefs);

  const [formData, setFormData] = useState({
    image: "",
    name: "",
    title: "",
    fb: "",
    in: "",
    x: "",
    web: "",
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
      setLocalError("Please upload a chef image");
      return;
    }

    if (!formData.name || !formData.title) {
      setLocalError("Name and title are required");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();

      const chefData = {
        ...formData,
        image: imageUrl,
      };

      await dispatch(createChef(chefData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        image: "",
        name: "",
        title: "",
        fb: "",
        in: "",
        x: "",
        web: "",
        show_at_home: false,
        status: true,
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create chef");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Chef
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Chef created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            label="Chef Image"
          />

          <TextField
            fullWidth
            label="Chef Name*"
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
            label="Chef Title*"
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
            label="Facebook URL"
            name="fb"
            value={formData.fb}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="LinkedIn URL"
            name="in"
            value={formData.in}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Twitter/X URL"
            name="x"
            value={formData.x}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="Website URL"
            name="web"
            value={formData.web}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

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
              label="Active Chef"
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
              {loading ? "Creating..." : "Create Chef"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChefForm;