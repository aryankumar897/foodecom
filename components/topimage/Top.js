"use client"


// components/BackgroundLayout.js
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function
    BackgroundLayout() {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '30vh',
                backgroundImage: 'url("/images/res1.jpg")', // Replace 'background.jpg' with your image file name
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: 'white',
            }}>
                <Typography variant="h6" >
                    Home &gt;   Details &gt;
                </Typography>
            </Box>

        </Box>
    );
};

