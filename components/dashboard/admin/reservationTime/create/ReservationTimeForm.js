"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useDispatch, useSelector } from "react-redux";
import { createReservationTime } from "@/slice/reservationTimeSlice";
import {
  formContainerStyles,
  titleStyles,
  alertStyles,
  submitButtonStyles,
  switchStyles,
  formInnerStyles,
} from "./reservationTimeFormStyles";

const ReservationTimeForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.reservationTimes);

  const [formData, setFormData] = useState({
    start_time: null,
    end_time: null,
    status: true,
  });

  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTimeChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  // Convert dayjs object to AM/PM format string
  const formatToAMPM = (time) => {
    if (!time) return "";
    return time.format("hh:mm A"); // Example: "07:00 AM"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.start_time || !formData.end_time) {
      setLocalError("Both start and end times are required");
      return;
    }

    const timeData = {
      start_time: formatToAMPM(formData.start_time), // "07:00 AM"
      end_time: formatToAMPM(formData.end_time), // "08:00 PM"
      status: formData.status,
    };

    try {
      await dispatch(createReservationTime(timeData)).unwrap();
      setLocalSuccess(true);

      setFormData({
        start_time: null,
        end_time: null,
        status: true,
      });
    } catch (error) {
      setLocalError(error.message || "Failed to create reservation time");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={formContainerStyles}>
        <Box sx={formInnerStyles}>
          <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
            Add New Reservation Time Slot
          </Typography>

          {(localError || error) && (
            <Alert severity="error" sx={alertStyles}>
              {localError || error}
            </Alert>
          )}

          {localSuccess && (
            <Alert severity="success" sx={alertStyles}>
              Time slot created successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 1, mt: 1 }}>
              Start Time
            </Typography>
            <TimePicker
              value={formData.start_time}
              onChange={handleTimeChange("start_time")}
              ampm={true}
              minutesStep={15}
              sx={{ width: "100%", mb: 3 }}
              slotProps={{
                textField: {
                  size: isSmallScreen ? "small" : "medium",
                },
              }}
            />

            <Typography variant="h6" sx={{ mb: 1 }}>
              End Time
            </Typography>
            <TimePicker
              value={formData.end_time}
              onChange={handleTimeChange("end_time")}
              ampm={true}
              minutesStep={15}
              sx={{ width: "100%", mb: 3 }}
              minTime={formData.start_time}
              slotProps={{
                textField: {
                  size: isSmallScreen ? "small" : "medium",
                },
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
              label="Active Time Slot"
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
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Creating..." : "Create Time Slot"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReservationTimeForm;
