"use client"
// pages/index.js
import { Container, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';

import { useState } from 'react';
import { TextField, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function IndexPage() {


    const categories = [
        { name: 'Category 1', count: 10 },
        { name: 'Category 2', count: 5 },
        { name: 'Category 3', count: 15 },
        { name: 'Category 4', count: 8 },
    ];


    const listings = [
        {
            image: '/images/res2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/res2.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/res3.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/res4.jpg',
            title: 'Box for date and comments: The date and comments are wrapped in a Box ',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },
        {
            image: '/images/res6.jpg',
            title: 'Sample Title',
            postedDate: 'June 23, 2024',
            commentsCount: 5,
        },

        // Add more listings as needed
    ];
  
        const handleSubmit = (event) => {
            event.preventDefault();
            const comment = event.target.comment.value;
            console.log(comment);
            // Handle form submission logic here
        };

  

    return (

        <Box sx={{
            margin: '0 auto',
            width: '80%',
            maxWidth: '1070px',
        }}>

            <Grid container spacing={3} style={{ marginTop: "30px" }}  >
                {/* Left Side */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            <Box
                                component="img"
                                src="/images/res3.jpg"
                                alt="jj"
                                sx={{
                                    width: 800,
                                    height: 400,
                                    marginRight: '10px',
                                    objectFit: 'cover',
                                    borderRadius: '4px', // Ensure the image has a square shape
                                }}
                            />
                        </Grid>




                        <Grid item xs={12} container spacing={2}>
                            {/* Verified */}
                            <Grid item style={{ display: 'flex' }}>
                                <IconButton aria-label="Verified">
                                    <VerifiedUserIcon style={{ color: 'red' }} />
                                </IconButton>
                                <Typography variant="body2"
                                    sx={{ marginTop: 1 }}

                                >john</Typography>
                            </Grid>
                            {/* Add to Favorites */}
                            <Grid item style={{ display: 'flex' }}>
                                <IconButton aria-label="Add to Favorites">
                                    <FavoriteIcon style={{ color: 'red' }} />
                                </IconButton>
                                <Typography variant="body2" sx={{ marginTop: 1 }}>comment</Typography>
                            </Grid>
                            {/* Views */}
                            <Grid item style={{ display: 'flex' }}>
                              

                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    <VisibilityIcon style={{ color: 'red' }} />   100 comments
                                </Typography>
                            </Grid>
                       

                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h4">jtitlee  Description of user or item goes here.
                            </Typography>

                        </Grid>


                        <Grid item xs={12}>
                            <Typography variant="body1"
                            
                                sx={{
                                    letterSpacing: '0.1em', // Character spacing
                                    lineHeight: '1.8', // Line height
                                    wordSpacing: '0.3em', // Word spacing
                                    fontWeight: 450, // Font weight
                                  
                                    marginBottom: 2,
                                    fontVariant: 'small-caps', // Font variant
                                    textTransform: 'capitalize', // Text transform // Optional: Adding some margin at the bottom
                                }}
                          
                            >
                                Description of user or item goes here.

                                Grid Container and Items: Use nested Grid containers and items to organize and align content.
                                Flex Display: Wrap each pair of IconButton and Typography inside a Grid item with display: flex CSS style to align them horizontally.
                                Icons and Text: Use Material-UI icons (VerifiedUserIcon, FavoriteIcon, VisibilityIcon, MapIcon, YouTubeIcon) and placeholder FontAwesome icons (fab icons for Facebook, Twitter, Instagram).
                                State Management: Uses useState hook for managing state (openVideoModal)Grid Container and Items: Use nested Grid containers and items to organize and align content.
                                Flex Display: Wrap each pair of IconButton and Typography inside a Grid item with display: flex CSS style to align them horizontally.
                                Icons and Text: Use Material-UI icons (VerifiedUserIcon, FavoriteIcon, VisibilityIcon, MapIcon, YouTubeIcon) and placeholder FontAwesome icons (fab icons for Facebook, Twitter, Instagram).
                                State Management: Uses useState hook for managing state (openVideoModal) to handle opening a modal or navigating to a video. to handle opening a modal or navigating to a video.

                            </Typography>
                        </Grid>














                        {/* Login to comment */}
                        <Grid item xs={12}>

                            <Typography variant="body1"  sx={{backgroundColor:"red"}}   >Login to leave a comment.</Typography>


                        </Grid>

                        <Grid item xs={12}>

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                         
                            >
                                <TextField
                                    id="comment"
                                    name="comment"
                                    label="Leave a comment"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    required
                                />
                                <Button
                             
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        marginTop:"12px",
                                        backgroundColor: 'red',
                                        '&:hover': {
                                            backgroundColor: '#ff6666', // Change this to the hover color you want
                                        },
                                    }}
                                    fullWidth
                                >
                                    Send
                                </Button>
                            </Box>

                        </Grid>





                    </Grid>
                </Grid>

                {/* Right Side */}




                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        {/* Contact Information */}


                        <Grid item xs={12}>


                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}
                            >
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    sx={{ flexGrow: 1, marginRight: '10px' }}
                                />
                                <Button

                                    variant="contained"

                                    sx={{

                                        backgroundColor: 'red',
                                        padding: "15px",

                                        borderColor: '#ff531a',
                                        '&:hover': {
                                            borderColor: '#ff531a',
                                        },

                                        '&:hover': {
                                            backgroundColor: 'red',
                                            border: '#ff531a',
                                            color: "white"
                                        },
                                    }}

                                >
                                    Search
                                </Button>
                            </Box>


                        </Grid>






                        {/* categories*/}


                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        marginTop: '10px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '20px',
                                        backgroundColor: '#fff',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                        Categories
                                    </Typography>
                                    {categories.map((category, index) => (
                                        <Box key={index}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px 0'
                                                }}
                                            >
                                                <Typography variant="body1">{category.name}</Typography>
                                                <Typography variant="body1">{category.count}</Typography>
                                            </Box>
                                            {index < categories.length - 1 && <Divider />}
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>



                        {/* similar blog*/}


                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                    padding: '10px',
                                    backgroundColor: '#fff',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                  letest blogs
                                </Typography>
                                {listings.map((listing, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={listing.image}
                                            alt={listing.title}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                marginRight: '10px',
                                                objectFit: 'cover',
                                                borderRadius: '4px', // Ensure the image has a square shape
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {listing.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginTop: '5px',
                                                }}
                                            >
                                                <Typography variant="body2" color="textSecondary">
                                                    {listing.postedDate}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {listing.commentsCount} comm
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>


                    </Grid>
                </Grid>
            </Grid>

        </Box>


    );
};





