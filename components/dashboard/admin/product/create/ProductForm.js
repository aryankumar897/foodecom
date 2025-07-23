// components/ProductForm.jsx
"use client";

import React, { useState, useEffect } from "react";
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
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";
import ImageUpload from "@/utility/ProductImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/slice/productSlice";
import { fetchCategories } from "@/slice/categorySlice";
import { runAi } from "@/ai/Ai";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
  aiButtonStyles
} from "./productFormStyles";

const ProductForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.categories);

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
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

  const generateAIContent = async (field) => {
    setIsGenerating(true);
    setLocalError("");

    try {
      let prompt = "";
      if (field === "short_description") {
        prompt = `Generate a short product description (1 sentence, 15-20 words) about ${formData.name} that:
        - Highlights key features
        - Mentions benefits
        - Simple and engaging
        - Should complement "${formData.name}"
        
        Return ONLY the description.`;
      } else if (field === "long_description") {
        prompt = `Write a detailed product description (3-4 sentences) about ${formData.name} that:
        - Covers all important features
        - Explains benefits clearly
        - Uses bullet points if needed
        - Professional but friendly tone
        
        Return ONLY the description.`;
      } else if (field === "seo_description") {
        prompt = `Create an SEO meta description (max 160 chars) for ${formData.name} that:
        - Contains primary keywords
        - Clearly states product benefits
        - Encourages clicks
        - Should work with "${formData.name}" and "${formData.short_description}"
        
        Return ONLY the description.`;
      }

      const aiResponse = await runAi(prompt);
      setFormData((prev) => ({ ...prev, [field]: aiResponse }));
    } catch (error) {
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate ${field}. ${error.message || "Please try again."}`
      );
    } finally {
      setIsGenerating(false);
    }
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
      setLocalError("Please upload a product image");
      return;
    }

    if (!formData.name || !formData.category_id || !formData.price) {
      setLocalError("Name, category and price are required");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();

      const productData = {
        ...formData,
        thumb_image: imageUrl,
        price: parseFloat(formData.price),
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
      };

      await dispatch(createProduct(productData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
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
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create product");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Product
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Product created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            label="Product Thumbnail"
          />

          <TextField
            fullWidth
            label="Product Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Category*</InputLabel>
            <Select
              labelId="category-label"
              label="Category*"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              sx={textFieldStyles}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Price*"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
              sx={textFieldStyles}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Offer Price"
              name="offer_price"
              type="number"
              value={formData.offer_price}
              onChange={handleChange}
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
              sx={textFieldStyles}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>

          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Short Description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              multiline
              rows={3}
              variant="outlined"
              sx={textFieldStyles}
            />
            <Tooltip title="Generate with AI">
              <IconButton
                onClick={() => generateAIContent("short_description")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh sx={{ color: "red" }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Long Description"
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              multiline
              rows={5}
              variant="outlined"
              sx={textFieldStyles}
            />
            <Tooltip title="Generate with AI">
              <IconButton
                onClick={() => generateAIContent("long_description")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh sx={{ color: "red" }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          <TextField
            fullWidth
            label="SEO Title"
            name="seo_title"
            value={formData.seo_title}
            onChange={handleChange}
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="SEO Description"
              name="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
              multiline
              rows={2}
              variant="outlined"
              sx={textFieldStyles}
            />
            <Tooltip title="Generate with AI">
              <IconButton
                onClick={() => generateAIContent("seo_description")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh sx={{ color: "red" }} />
                )}
              </IconButton>
            </Tooltip>
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
              label="Active Product"
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size={isSmallScreen ? "medium" : "large"}
              disabled={loading || isGenerating}
              sx={submitButtonStyles}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ProductForm;