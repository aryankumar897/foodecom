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
import { createBlog } from "@/slice/blogSlice"; // ✅ Blog slice
import { fetchCategories } from "@/slice/categorySlice"; // ✅ For blog categories
import { runAi } from "@/ai/Ai";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
  aiButtonStyles,
} from "./productFormStyles"; // ✅ reuse same styles

const BlogForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.blogs);
  const { list: categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    thumb_image: "",
    short_description: "",
    content: "",

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

// Add this function inside BlogForm
const generateAITitle = async () => {
  if (!formData.category_id) {
    setLocalError("Please select a category first");
    return;
  }

  setIsGenerating(true);
  setLocalError("");

  try {
    const selectedCategory = categories.find(
      (cat) => cat._id === formData.category_id
    )?.name;

    const prompt = `Generate an engaging and SEO-friendly blog title for the category "${selectedCategory}". 
      - Make it catchy and relevant.
      - Limit to 8-12 words.
      - Return ONLY the title.`;

    const aiResponse = await runAi(prompt);
    setFormData((prev) => ({ ...prev, title: aiResponse }));
  } catch (error) {
    setLocalError(
      `Failed to generate title. ${error.message || "Please try again."}`
    );
  } finally {
    setIsGenerating(false);
  }
};





  const generateAIContent = async (field) => {
    setIsGenerating(true);
    setLocalError("");

    try {
      // find the selected category name
      const selectedCategory = categories.find(
        (cat) => cat._id === formData.category_id
      )?.name;

      let prompt = "";
      if (field === "short_description") {
        prompt = `Generate a short blog excerpt (1–2 sentences) for a blog titled "${formData.title}" in the category "${selectedCategory}". 
      - Keep it engaging and relevant to ${selectedCategory}.
      - Make it intriguing so users want to read the full article.
      Return ONLY the excerpt.`;
      } else if (field === "content") {
        prompt = `Write a detailed blog article (4–5 paragraphs) about "${formData.title}" under the category "${selectedCategory}". 
      - Use a conversational and informative tone.
      - Ensure the content is relevant to ${selectedCategory}.
      - Add examples, tips, or insights where appropriate.
      - Structure it so it reads like a professional blog.
      Return ONLY the blog content.`;
      }

      const aiResponse = await runAi(prompt);
      setFormData((prev) => ({ ...prev, [field]: aiResponse }));
    } catch (error) {
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

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!imageFile) {
      setLocalError("Please upload a blog thumbnail");
      return;
    }
    if (!formData.title || !formData.category_id || !formData.content) {
      setLocalError("Title, category and content are required");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();
      const blogData = { ...formData, thumb_image: imageUrl };

      await dispatch(createBlog(blogData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        title: "",
        category_id: "",
        thumb_image: "",
        short_description: "",
        content: "",

        status: true,
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create blog");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" gutterBottom sx={titleStyles}>
          Add New Blog
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}
        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Blog created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            label="Blog Thumbnail"
          />

         

         <Box sx={{ position: "relative", mb: 3 }}>
  <TextField
    fullWidth
    label="Blog Title*"
    name="title"
    value={formData.title}
    onChange={handleChange}
    required
    variant="outlined"
    size={isSmallScreen ? "small" : "medium"}
    sx={textFieldStyles}
  />
  <Tooltip title="Generate Title with AI">
    <IconButton
      onClick={generateAITitle}
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

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Category*</InputLabel>
            <Select
              labelId="category-label"
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

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Short Description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              multiline
              rows={3}
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
              label="Content*"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={8}
              required
              sx={textFieldStyles}
            />
            <Tooltip title="Generate with AI">
              <IconButton
                onClick={() => generateAIContent("content")}
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
                  checked={formData.status}
                  onChange={handleSwitchChange}
                  name="status"
                  sx={switchStyles}
                />
              }
              label="Publish"
            />
          </Box>

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
            {loading ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default BlogForm;
