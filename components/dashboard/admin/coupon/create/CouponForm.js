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
  Grid,
} from "@mui/material";
import { AutoFixHigh, Discount } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon } from "@/slice/couponSlice";
import { runAi } from "@/ai/Ai";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./couponFormStyles";

const couponTypes = [
  "Percentage Discount",
  "Fixed Amount",
  "Free Shipping",
  "Buy One Get One",
  "Seasonal Offer",
];

const discountTypes = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount" },
];

const CouponForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.coupons);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    quantity: 100,
    min_purchase_amount: 0,
    expire_date: "",
    discount_type: "percentage",
    discount: 10,
    status: true,
  });

  const [couponType, setCouponType] = useState("");
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

  const handleCouponTypeChange = (e) => {
    setCouponType(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const generateCouponSuggestion = async () => {
    setIsGenerating(true);
    setLocalError("");

    try {
      if (!couponType) {
        setLocalError("Please select a coupon type first");
        return;
      }

      const prompt = `Generate 15 UNIQUE coupon code names for ${couponType} promotion. STRICT RULES:

      1. FORMAT: Exactly 15 options, comma-separated, NO numbering
      2. LENGTH: 6-12 characters each, uppercase letters and numbers only
      3. PATTERNS: Mix these approaches equally:
         - Brand-related (e.g., "SUMMER25")
         - Occasion-based (e.g., "HOLIDAY30")
         - Value-focused (e.g., "SAVE20NOW")
         - Fun/creative (e.g., "FREESHIP22")
      4. NEVER USE: "TEST, DEMO, SAMPLE, TEMP"

      TYPE-SPECIFIC EXAMPLES:
      - Percentage Discount: "SAVE20", "FALL15", "WELCOME10"
      - Fixed Amount: "5OFF50", "10BUCKS", "DISCOUNT5"
      - Free Shipping: "FREESHIP", "SHIPFREE", "NOSHIPPING"
      - Buy One Get One: "BOGO2023", "BUY1GET1", "FREEGIFT"
      - Seasonal Offer: "SUMMER23", "BLACKFRI", "NEWYEAR24"

      Generate ONLY for ${couponType}:`;

      const aiResponse = await runAi(prompt);
      const suggestions = aiResponse
        .split(",")
        .map((s) => s.trim().replace(/\.$/, "").toUpperCase())
        .filter((s) => /^[A-Z0-9]{6,12}$/.test(s)); // Validate format

      if (suggestions.length > 0) {
        // Rotate through suggestions to maximize variety
        const randomIndex = Math.floor(
          Math.random() * Math.min(suggestions.length, 5)
        );
        setFormData((prev) => ({
          ...prev,
          code: suggestions[randomIndex],
          name: `${couponType} Coupon`,
        }));
      }
    } catch (error) {
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate suggestions. ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    // Validation
    if (!formData.name || !formData.code) {
      setLocalError("Name and code are required");
      return;
    }

    if (
      formData.discount_type === "percentage" &&
      (formData.discount < 0 || formData.discount > 100)
    ) {
      setLocalError("Percentage discount must be between 0-100");
      return;
    }

    if (formData.discount_type === "fixed" && formData.discount < 0) {
      setLocalError("Fixed discount must be positive");
      return;
    }

    if (new Date(formData.expire_date) <= new Date()) {
      setLocalError("Expiration date must be in the future");
      return;
    }

    try {
      await dispatch(
        createCoupon({
          ...formData,
          code: formData.code.toUpperCase().trim(), // Standardize code format
          expire_date: new Date(formData.expire_date).toISOString(),
        })
      ).unwrap();

      setLocalSuccess(true);

      // Reset form but keep some defaults
      setFormData({
        name: "",
        code: "",
        quantity: 100,
        min_purchase_amount: 0,
        expire_date: "",
        discount_type: "percentage",
        discount: 10,
        status: true,
      });
      setCouponType("");
    } catch (error) {
      setLocalError(error.message || "Failed to create coupon");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Box sx={formInnerStyles}>
        <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
          Create New Coupon
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={alertStyles}>
            {localError || error}
          </Alert>
        )}

        {localSuccess && (
          <Alert severity="success" sx={alertStyles}>
            Coupon created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Coupon Type</InputLabel>
            <Select
              value={couponType}
              onChange={handleCouponTypeChange}
              label="Coupon Type"
              size={isSmallScreen ? "small" : "medium"}
            >
              {couponTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Name*"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                size={isSmallScreen ? "small" : "medium"}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Coupon Code*"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                variant="outlined"
                size={isSmallScreen ? "small" : "medium"}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Generate coupon code with AI">
                        <IconButton
                          onClick={generateCouponSuggestion}
                          disabled={!couponType || isGenerating}
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
                helperText="Uppercase letters and numbers only"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity*"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                variant="outlined"
                size={isSmallScreen ? "small" : "medium"}
                sx={textFieldStyles}
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Purchase Amount"
                name="min_purchase_amount"
                type="number"
                value={formData.min_purchase_amount}
                onChange={handleChange}
                variant="outlined"
                size={isSmallScreen ? "small" : "medium"}
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  inputProps: { min: 0, step: 0.01 },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Discount Type*</InputLabel>
                <Select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  label="Discount Type*"
                  size={isSmallScreen ? "small" : "medium"}
                >
                  {discountTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Discount Value${
                  formData.discount_type === "percentage" ? "%" : "($)"
                }*`}
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                required
                variant="outlined"
                size={isSmallScreen ? "small" : "medium"}
                sx={{ ...textFieldStyles, mt: 2 }}
                InputProps={{
                  endAdornment:
                    formData.discount_type === "percentage" ? (
                      <InputAdornment position="end">%</InputAdornment>
                    ) : (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  inputProps: {
                    min: 0,
                    max:
                      formData.discount_type === "percentage" ? 100 : undefined,
                  },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Expiration Date*"
            name="expire_date"
            type="datetime-local"
            value={formData.expire_date}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={{ ...textFieldStyles, mt: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().slice(0, 16), // Prevent past dates
            }}
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
            label="Active Coupon"
            sx={{ mt: 2, mb: 3 }}
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
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Discount />
                )
              }
            >
              {loading ? "Creating..." : "Create Coupon"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CouponForm;
