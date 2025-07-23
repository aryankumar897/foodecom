// components/SliderForm.jsx
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
  IconButton,
  Tooltip,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";
import ImageUpload from "@/utility/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createSlider } from "@/slice/sliderSlice";
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
} from "./sliderFormStyles";

const SliderForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.sliders);

  const [formData, setFormData] = useState({
    offer: "",
    title: "",
    sub_title: "",
    short_description: "",
    button_link: "",
    status: true,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const generateAIContent = async (field) => {
    setIsGenerating(true);
    setLocalError("");

    try {
      let prompt = "";
      if (field === "title") {
        prompt = `Generate an attractive slider title about ${
          formData.offer || "a special offer"
        } with these requirements:
        - Maximum 6-8 words
        - Attention-grabbing but not clickbaity
        - Include power words (Amazing, Exclusive, Limited, etc.)
        - Title case formatting
        - Should complement the offer "${formData.offer}"
        
        Return ONLY the title, no additional text.`;
      } else if (field === "sub_title") {
        prompt = `Create a compelling slider subtitle about ${
          formData.title || "our promotion"
        } with:
        - Maximum 10-12 words
        - Supporting message for the main title
        - Include a benefit or value proposition
        - Sentence case formatting
        - Should work with "${formData.title}"
        
        Return ONLY the subtitle.`;
      } else if (field === "short_description") {
        prompt = `Write a short slider description (1 sentence, 15-20 words max) about ${
          formData.title || "our offer"
        } that:
        - Highlights key benefits
        - Creates urgency if applicable
        - Simple and easy to understand
        - Should complement "${formData.title}" and "${formData.sub_title}"
        
        Return ONLY the description.`;
      }

      const aiResponse = await runAi(prompt);
      setFormData((prev) => ({ ...prev, [field]: aiResponse }));
    } catch (error) {
        alert(error)
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate ${field}. ${error.message || "Please try again."}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
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
      setLocalError("Please upload an image");
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const sliderData = {
        ...formData,
        image: imageUrl,
      };

      await dispatch(createSlider(sliderData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        offer: "",
        title: "",
        sub_title: "",
        short_description: "",
        button_link: "",
        status: true,
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create slider");
    }
  };

  return (
    <Box sx={formContainerStyles}>

<Box sx={formInnerStyles}>

      <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
        Add New Slider
      </Typography>

      {(localError || error) && (
        <Alert severity="error" sx={alertStyles}>
          {localError || error}
        </Alert>
      )}

      {localSuccess && (
        <Alert severity="success" sx={alertStyles}>
          Slider created successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <ImageUpload
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
        />

        <TextField
          fullWidth
          label="Offer Text (e.g., '50% OFF')"
          name="offer"
          value={formData.offer}
          onChange={handleChange}
          variant="outlined"
          size={isSmallScreen ? "small" : "medium"}
          sx={textFieldStyles}
        />

        <Box sx={{ position: "relative", mb: 3 }}>
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
          <Tooltip title="Generate with AI">
            <IconButton
              onClick={() => generateAIContent("title")}
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
            label="Sub Title*"
            name="sub_title"
            value={formData.sub_title}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
          />
          <Tooltip title="Generate with AI">
            <IconButton
              onClick={() => generateAIContent("sub_title")}
              disabled={isGenerating}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
              }}
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
              sx={{
                position: "absolute",
                right: 8,
                top: 16,
              }}
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
          label="Button Link*"
          name="button_link"
          value={formData.button_link}
          onChange={handleChange}
          required
          variant="outlined"
          size={isSmallScreen ? "small" : "medium"}
          sx={textFieldStyles}
          placeholder="https://example.com"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={handleStatusChange}
              name="status"
              sx={switchStyles}
            />
          }
          label="Active Slider"
          sx={{ mb: 3 }}
        />

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
            {loading ? "Creating..." : "Create Slider"}
          </Button>
        </Box>
      </form>
</Box>


    </Box>
  );
};

export default SliderForm;
