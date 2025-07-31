"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageUploader } from "@/components/imageupload/ImageUploader";

import {
 
  TextField,
  Button,
  Alert,
  CircularProgress ,
  InputAdornment,
} from "@mui/material";
import { ProfileHeroSection } from "./ProfileHeroSection";
import { Email, Person } from "@mui/icons-material";

import {
  AuthContainer,
  ImageSection,
  Overlay,
  ImageContent,
  FormSection,
  FormContainer,
  SocialButtonsContainer,
  AuthFooter,
  GoogleButton,
  FacebookButton,
  AppleButton,
} from "./loginStyles";

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const {
    imagePreview,
    uploadError,
    isUploading,
    fileInputRef,
    triggerFileInput,
    onImageChange,
    uploadImage,
    setImagePreview,
  } = useImageUpload(session?.user?.image || "");

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
      setImagePreview(session.user.image || "");
    }
  }, [session, setImagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      // Upload new image if changed
      let imageUrl = formData.image;
      if (imagePreview !== formData.image) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Update profile
      const updatedData = { ...formData, image: imageUrl };

 console.log("updatedData" ,updatedData )

      const response = await fetch(`${process.env.API}/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...updatedData,
          },
        });
        setSubmitSuccess("Profile updated successfully!");
        setFormData(updatedData);
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContainer>
      <ProfileHeroSection
        imageUrl={session?.user?.image}
        name={session?.user?.name}
        role={session?.user?.role || "Member"}
      />

      <FormSection>
        <FormContainer>
          {/* Image Uploader */}
          <ImageUploader
            imagePreview={imagePreview}
            uploadError={uploadError}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            triggerFileInput={triggerFileInput}
            onImageChange={onImageChange}
          />

          {/* Name Field */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            variant="outlined"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
          onClick={handleSubmit}
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isSubmitting || isUploading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              color: "white",
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </Button>

          {/* Error/Success Messages */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {submitSuccess}
            </Alert>
          )}
        </FormContainer>
      </FormSection>
    </AuthContainer>
  );
};

export default ProfilePage;
