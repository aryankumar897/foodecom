import { useState, useRef } from 'react';
import { uploadImageToCloudinary, handleImageChange } from '../utils/cloudinary';

export const useImageUpload = (initialImage = '') => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onImageChange = (event) => {
    try {
      handleImageChange(event, setImageFile, setImagePreview);
      setUploadError('');
    } catch (error) {
      setUploadError(error.message);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    setUploadError('');
    
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      return imageUrl;
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    fileInputRef,
    triggerFileInput,
    onImageChange,
    uploadImage,
    setImagePreview, // Allow manual setting of preview (for initial values)
  };
};