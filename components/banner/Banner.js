"use client"


import React from 'react';
import { Box, Badge, Rating, Container } from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CompareIcon from '@mui/icons-material/Compare';
import VisibilityIcon from '@mui/icons-material/Visibility';




const dummyData = [
    {
        id: 1,
        imageUrl: '/images/res1.jpg',
        percentage: '50%',
        title: 'Sample Title 1',
        description: 'This is a sample description for item 1.'
    },
    {
        id: 2,
        imageUrl: '/images/res2.jpg',
        percentage: '70%',
        title: 'Sample Title 2',
        description: 'This is a sample description for item 2.'
    },
    {
        id: 1,
        imageUrl: '/images/res3.jpg',
        percentage: '50%',
        title: 'Sample Title 1',
        description: 'This is a sample description for item 1.'
    },
    {
        id: 2,
        imageUrl: '/images/res5.jpg',
        percentage: '70%',
        title: 'Sample Title 2',
        description: 'This is a sample description for item 2.'
    }

];



export default function ClientSaid() {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        focusOnSelect: true,
        initialSlide: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (


        <Box sx={{ backgroundColor: "#ffe6e6" }} p={10} >

            <Box sx={{
                margin: '0 auto',
                width: '80%',
                maxWidth: '1070px',
            }}>

               



                <Slider {...settings}>

                    {dummyData.map((item) => (



                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', marginLeft: 1 }}>
                                <CardMedia
                                    component="img"
                                    image={item.imageUrl}
                                    alt={item.title}
                                    sx={{ width: '100%', height: 230, objectFit: 'cover' }}
                                />
                                <CardContent
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        color: 'white',
                                        padding: '16px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <Typography variant="h6" component="div" sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 900,
                                        textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                                        zIndex: 11111,
                                      
                                    }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 600,
                                        zIndex: 11111,
                                       
                                    }}>
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                
                
                    ))}

                </Slider>
            </Box></Box>
    );
}