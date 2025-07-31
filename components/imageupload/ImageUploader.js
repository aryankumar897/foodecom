import React from 'react';
import { Avatar, IconButton, Box, CircularProgress, Tooltip } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import {
  Typography,
  
} from "@mui/material";
export const ImageUploader = ({
  imagePreview,
  uploadError,
  isUploading,
  fileInputRef,
  triggerFileInput,
  onImageChange,
  size = 120,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Tooltip title="Click to change photo">
          <Avatar
            src={imagePreview || '/default-avatar.jpg'}
            sx={{
              width: size,
              height: size,
              cursor: 'pointer',
              border: '3px solid',
              borderColor: uploadError ? 'error.main' : 'primary.main',
              opacity: isUploading ? 0.7 : 1,
            }}
            onClick={triggerFileInput}
          />
        </Tooltip>

        {isUploading && (
          <CircularProgress
            size={size * 0.3}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: `-${size * 0.15}px`,
              marginLeft: `-${size * 0.15}px`,
            }}
          />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <IconButton
          color="primary"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper',
          }}
          onClick={triggerFileInput}
        >
          <PhotoCamera />
        </IconButton>
      </Box>

      {uploadError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'error.main',
            gap: 1,
          }}
        >
          <ErrorOutline fontSize="small" />
          <Typography variant="caption">{uploadError}</Typography>
        </Box>
      )}
    </Box>
  );
};