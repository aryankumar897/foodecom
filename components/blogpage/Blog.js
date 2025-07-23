"use client"
import React from 'react';
import Head from 'next/head';

import Badge from '@mui/material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event'; // Import EventIcon for date

import {  Box, Grid, Container, Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: 'red', // Customize the badge color here
        color: 'white', // Customize the badge text color here (if any)
        width: '120px', // Increase the width of the badge
        height: '20px',
    },
}));

const HomePage = () => {
    // Dummy data for blog posts
    const posts = [
        {
            id: 1,
            title: 'Sample Blog Post 1',
            image: '/images/res7.jpg',
            categories: ['Technology', 'Next.js'],
            date: '2024-06-21',
            user: {
                name: 'John Doe',
                icon: '/images/res4.jpg'
            },
            description: 'This is the content of Sample Blog Post 1. You can add more details here.',
        },
        {
            id: 2,
            title: 'Sample Blog Post 2',
            image: '/images/res3.jpg',
            categories: ['Design', 'UI/UX'],
            date: '2024-06-20',
            user: {
                name: 'Jane Smith',
                icon: '/images/res3.jpg'
            },
            description: 'This is the content of Sample Blog Post 2. You can add more details here.',
        },
        {
            id: 3,
            title: 'Sample Blog Post 3',
            image: '/images/res2.jpg',
            categories: ['Design', 'UI/UX'],
            date: '2024-06-20',
            user: {
                name: 'Michael Johnson',
                icon: '/images/res2.jpg'
            },
            description: 'This is the content of Sample Blog Post 3. You can add more details here.',
        },
        // Add more posts as needed
    ];

    return (
        <Box sx={{
            margin: '0 auto',
            width: '80%',  // Set full width of the container
            maxWidth: '1080px',
        }}>

            <Box textAlign="center" mt={14}>

                <Typography variant="h4" gutterBottom>
                    Our Blog
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Adjust the styles and properties to fit your specific components from Material-UI.
                </Typography>

            </Box>

            <Container sx={{ marginTop: "20px" }}>
                <Grid container spacing={3}>
                    {posts.map(post => (
                        <Grid item key={post.id} xs={12} sm={6} md={4}>
                            <Card sx={{ margin: '2px' }}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={post.image}
                                    alt={post.title}
                                    sx={{
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                />
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>

                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            <EventIcon sx={{ color: 'red',}} />    {new Date(post.date).toLocaleDateString()}
                                        </Typography>
                                        {/* <img src={post.user.icon} alt={post.user.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} /> */}
                                      

                                        <StyledBadge
                                        
                                            badgeContent={post.user.name}
                                            sx={{ ml: 1, mt: -10 }}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                           
                                        </StyledBadge>

                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mt: 1 }}>
                                            <PersonIcon sx={{ color: 'red'}} />   {post.user.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 5, mt: 1 }}>
                                            <CommentIcon sx={{ color: 'red' }} /> 0  comment
                                        </Typography>

                                    </Box>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {post.title}
                                    </Typography>

                                    {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {post.description}
                                    </Typography> */}

                                </CardContent>
                                {/* <CardActions>
                                    <Button

                                        sx={{

                                            color: "#ff531a",

                                        }}

                                        size="small"


                                    >Learn More</Button>
                                </CardActions> */}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
