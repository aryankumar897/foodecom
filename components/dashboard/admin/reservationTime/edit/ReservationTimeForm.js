"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ReservationTimeForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  // Initialize with null or properly parsed Dayjs objects
  const [formData, setFormData] = useState({
    start_time: null,
    end_time: null,
    status: true,
  });

  const [error, setError] = useState("");

  // Convert string times to Dayjs objects when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        start_time: initialValues.start_time 
          ? dayjs(initialValues.start_time, 'HH:mm') 
          : null,
        end_time: initialValues.end_time 
          ? dayjs(initialValues.end_time, 'HH:mm') 
          : null,
        status: initialValues.status ?? true,
      });
    }
  }, [initialValues]);

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

//   const formatTimeForServer = (time) => {
//     if (!time) return "";
//     return time.format('HH:mm');
//   };


  // Convert dayjs object to AM/PM format string
  const formatToAMPM = (time) => {
    if (!time) return "";
    return time.format("hh:mm A"); // Example: "07:00 AM"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.start_time || !formData.end_time) {
      setError("Both start and end times are required");
      return;
    }

    // Convert to 24-hour format for server
    const timeData = {
      start_time: formatToAMPM(formData.start_time),
      end_time: formatToAMPM(formData.end_time),
      status: formData.status,
    };

    try {
      await onSubmit(timeData);
    } catch (err) {
      setError(err.message || "Failed to save time slot");
      toast.error("Failed to save time slot");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

        <Typography variant="h6" sx={{ mb: 1 }}>
          Start Time
        </Typography>
        <TimePicker
          value={formData.start_time}
          onChange={handleTimeChange('start_time')}
          ampm={true}
          minutesStep={15}
          sx={{ width: '100%', mb: 3 }}
          slotProps={{ 
            textField: { 
              size: isSmallScreen ? 'small' : 'medium',
            } 
          }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>
          End Time
        </Typography>
        <TimePicker
          value={formData.end_time}
          onChange={handleTimeChange('end_time')}
          ampm={true}
          minutesStep={15}
          sx={{ width: '100%', mb: 3 }}
          minTime={formData.start_time}
          slotProps={{ 
            textField: { 
              size: isSmallScreen ? 'small' : 'medium',
            } 
          }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={handleStatusChange}
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
          label="Active Status"
          sx={{ my: 1 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : "Save Time Slot"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ReservationTimeForm;