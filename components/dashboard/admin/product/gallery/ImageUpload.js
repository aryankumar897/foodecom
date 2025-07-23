// components/ImageUpload.jsx
"use client";
import React, { useCallback,useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";

const ImageUpload = ({ onFileSelect, accept = "image/*", disabled = false }) => {
  const [preview, setPreview] = useState("");

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: "none" }}
        id="image-upload-input"
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <label htmlFor="image-upload-input">
        <Box
          sx={{
            width: 150,
            height: 150,
            border: "2px dashed #ccc",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <AddPhotoAlternate sx={{ fontSize: 40, color: "#999" }} />
              <Typography variant="caption" sx={{ mt: 1, color: "#999" }}>
                Select Image
              </Typography>
            </>
          )}
        </Box>
      </label>
    </Box>
  );
};

export default ImageUpload;