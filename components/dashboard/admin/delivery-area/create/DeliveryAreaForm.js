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
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createDeliveryArea } from "@/slice/deliveryAreaSlice";
import { runAi } from "@/ai/Ai"; // ✅ your original AI logic

// Reuse your existing MUI styles
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./deliveryAreaFormStyles";

const DeliveryAreaForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.deliveryAreas);

  const [formData, setFormData] = useState({
    area_name: "",
    min_delivery_time: "",
    max_delivery_time: "",
    delivery_fee: "",
    status: true,
  });

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

  const generateAreaSuggestion = async () => {
    setIsGenerating(true);
    setLocalError("");

    try {
      const prompt = `Generate 15 UNIQUE and realistic DELIVERY AREA names for a food delivery app. STRICT RULES:
- FORMAT: comma-separated, NO numbering
- LENGTH: max 3 words, 10–25 characters
- LOCATION STYLES: mix of city zones, market areas, and nickname-style places
- NEVER USE: "Generic Area, Common Place, Area 1"`;

      const aiResponse = await runAi(prompt);
      const suggestions = aiResponse
        .split(",")
        .map((s) => s.trim().replace(/\.$/, ""))
        .filter((s) => s.length >= 5 && s.length <= 25);

      if (suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(suggestions.length, 5));
        setFormData((prev) => ({ ...prev, area_name: suggestions[randomIndex] }));
      }
    } catch (error) {
      console.error("AI error:", error);
      setLocalError("Failed to generate suggestion. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    const { area_name, min_delivery_time, max_delivery_time, delivery_fee } = formData;
    if (!area_name || !min_delivery_time || !max_delivery_time || !delivery_fee) {
      setLocalError("All fields are required");
      return;
    }

    try {
      await dispatch(createDeliveryArea(formData)).unwrap();
      setLocalSuccess(true);
      setFormData({
        area_name: "",
        min_delivery_time: "",
        max_delivery_time: "",
        delivery_fee: "",
        status: true,
      });
    } catch (error) {
      setLocalError(error.message || "Failed to create delivery area");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Add Delivery Area
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Delivery area created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Area Name*"
            name="area_name"
            value={formData.area_name}
            onChange={handleChange}
            variant="outlined"
            required
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate area name with AI">
                    <IconButton
                      onClick={generateAreaSuggestion}
                      disabled={isGenerating}
                      edge="end"
                    >
                      {isGenerating ? (
                        <CircularProgress size={24} />
                      ) : (
                        <AutoFixHigh sx={{ color: "red" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Minimum Delivery Time*"
            name="min_delivery_time"
            value={formData.min_delivery_time}
            onChange={handleChange}
            variant="outlined"
            required
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            placeholder="e.g., 15 min"
          />

          <TextField
            fullWidth
            label="Maximum Delivery Time*"
            name="max_delivery_time"
            value={formData.max_delivery_time}
            onChange={handleChange}
            variant="outlined"
            required
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            placeholder="e.g., 45 min"
          />

          <TextField
            fullWidth
            label="Delivery Fee (₹)*"
            name="delivery_fee"
            type="number"
            value={formData.delivery_fee}
            onChange={handleChange}
            variant="outlined"
            required
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
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
            label="Active Delivery Area"
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
              {loading ? "Creating..." : "Create Delivery Area"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default DeliveryAreaForm;
