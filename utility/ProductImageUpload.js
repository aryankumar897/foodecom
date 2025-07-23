// components/ImageUpload.jsx
"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";

const ImageUpload = ({ imagePreview, setImagePreview, setImageFile, label = "Image" }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }

    // Validate image size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
        {label}
      </Typography>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="image-upload-input"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="image-upload-input">
        <IconButton component="span" sx={{ p: 0, width: "100%" }}>
          <Box sx={{
            width: '100%',
            height: 300, // Increased from 200 to 300
            border: '2px dashed #ccc',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              borderColor: 'red',
            },
          }}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#999',
              }}>
                <AddPhotoAlternate sx={{ fontSize: 50, color: 'red' }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Click to upload image
                </Typography>
              </Box>
            )}
          </Box>
        </IconButton>
      </label>
    </Box>
  );
};

export default ImageUpload;