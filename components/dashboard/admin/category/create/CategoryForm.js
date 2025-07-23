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
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "@/slice/categorySlice";
import { runAi } from "@/ai/Ai";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./categoryFormStyles";

const categoryTypes = [
  "Restaurant",
  "Food",
  "E-commerce",
  "Booking",
  "Travel",
  "Healthcare",
  "Education",
  "Entertainment"
];

const CategoryForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    status: true,
    show_at_home: false,
  });

  const [categoryType, setCategoryType] = useState("");
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

  const handleCategoryTypeChange = (e) => {
    setCategoryType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const handleShowAtHomeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      show_at_home: e.target.checked,
    }));
  };

const generateCategorySuggestion = async () => {
  setIsGenerating(true);
  setLocalError("");

  try {
    if (!categoryType) {
      setLocalError("Please select a category type first");
      return;
    }

    const prompt = `Generate 15 UNIQUE category names for ${categoryType} business. STRICT RULES:

    1. FORMAT: Exactly 15 options, comma-separated, NO numbering
    2. LENGTH: 2-3 words each, under 25 characters
    3. STYLES: Mix these approaches equally:
       - Functional (what it is)
       - Premium (luxury versions)
       - Technical (specific features)
       - Time-based (seasonal/temporal)
    4. NEVER USE: "Basic, General, Standard, Normal, Regular"

    INDUSTRY-SPECIFIC EXAMPLES:
    - Restaurant: "Chef's Tastings, Plant-Based Bowls, Mixology Creations"
    - Food: "Artisan Pantry, Meal Kits, Specialty Imports"
    - E-commerce: "Flash Deals, Eco Picks, Collector's Corner"
    - Booking: "VIP Experiences, Last-Minute Getaways, Group Packages"
    - Travel: "Adventure Modules, Cultural Immersions, Luxury Transit"
    - Healthcare: "Preventive Plans, Specialty Consultations, Wellness Packages"
    - Education: "Micro-Credentials, Skill Bootcamps, Expert Masterclasses"
    - Entertainment: "Behind-the-Scenes, Limited Engagements, Interactive Experiences"

    Generate ONLY for ${categoryType}:`;

    const aiResponse = await runAi(prompt);
    const suggestions = aiResponse.split(',')
      .map(s => s.trim().replace(/\.$/, ''))
      .filter(s => s.length > 2 && s.length <= 25); // Minimum 3 chars
    
    if (suggestions.length > 0) {
      // Rotate through suggestions to maximize variety
      const randomIndex = Math.floor(Math.random() * Math.min(suggestions.length, 5));
      setFormData(prev => ({ ...prev, name: suggestions[randomIndex] }));
    }
  } catch (error) {
    console.error("AI generation error:", error);
    setLocalError(
      `Failed to generate suggestions. ${error.message || "Please try again."}`
    );
  } finally {
    setIsGenerating(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.name) {
      setLocalError("Category name is required");
      return;
    }

    try {
      await dispatch(createCategory(formData)).unwrap();
      setLocalSuccess(true);

      // Reset form
      setFormData({
        name: "",
        status: true,
        show_at_home: false,
      });
      setCategoryType("");
    } catch (error) {
      setLocalError(error.message || "Failed to create category");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add New Category
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Category created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category Type</InputLabel>
            <Select
              value={categoryType}
              onChange={handleCategoryTypeChange}
              label="Category Type"
              size={isSmallScreen ? "small" : "medium"}
            >
              {categoryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Category Name*"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate category suggestions with AI">
                    <IconButton 
                      onClick={generateCategorySuggestion}
                      disabled={!categoryType || isGenerating}
                      edge="end"
                    >
                      {isGenerating ? (
                        <CircularProgress size={24} />
                      ) : (
                        <AutoFixHigh sx={{ color: "red" }}  />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            helperText="Slug will be auto-generated from the name"
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
            label="Active Category"
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.show_at_home}
                onChange={handleShowAtHomeChange}
                name="show_at_home"
                sx={switchStyles}
              />
            }
            label="Show on Homepage"
            sx={{ mb: 3 }}
          />

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
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CategoryForm;