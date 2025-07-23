// components/dashboard/admin/product/gallery/ProductGallery.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, AddPhotoAlternate } from "@mui/icons-material";
import ImageUpload from "./ImageUpload";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ProductGallery = () => {
  const { id } = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.API}/admin/product-gallery?product_id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setGallery(data);
      } else {
        throw new Error(data.err || "Failed to fetch gallery");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "ml_default");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { secure_url } = await uploadRes.json();

      // Save to database
      const saveRes = await fetch(`${process.env.API}/admin/product-gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: id,
          image: secure_url,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save image");
      
      toast.success("Image added to gallery");
      fetchGallery();
      setImageFile(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to upload image");
    } finally {
         setImageFile(null);
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await fetch(`${process.env.API}/admin/product-gallery/${imageToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete image");
      
      toast.success("Image removed from gallery");
      fetchGallery();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to delete image");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Product Gallery</Typography>
        <Button
          variant="contained"
          onClick={() => router.push(`/dashboard/admin/product/edit/${id}`)}
        >
          Back to Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Add New Image
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ImageUpload
            onFileSelect={setImageFile}
            accept="image/*"
            disabled={uploading}
          />
          <Button
            variant="contained"
            onClick={handleImageUpload}
            disabled={!imageFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <AddPhotoAlternate />}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : gallery.length === 0 ? (
        <Typography>No images in gallery yet</Typography>
      ) : (
        <Grid container spacing={2}>
          {gallery.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Box sx={{ position: "relative", borderRadius: 1, overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={`Product gallery ${item._id}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setImageToDelete(item._id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteImage}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductGallery;