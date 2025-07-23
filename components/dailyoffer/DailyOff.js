"use client"


import React from 'react';
import { Box,  Badge, Rating, Container } from '@mui/material';
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

            <Box textAlign="center" mt={14}

                sx={{
                    margin: '0 auto',
                    maxWidth: '600px',
                }}

            >


                    <Typography variant="body4" gutterBottom mt={14}
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 600,
 color:"red",
                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


                        }}


                    >
                       dailyoff
                    </Typography>


                <Typography variant="h4" gutterBottom mt={1} 
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 900,

                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


                        }}
                
                
                 >
                   Upto 90% off this day order now
                </Typography>
                <Typography variant="body2" gutterBottom 
                        mb={4} 
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 300,

                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


                        }}
                
                
                
                  >

                    Adjust the styles (sx props) and other properties
                    (such as colors, padding, etc.) to fit your specific

                    components from Material-UI (Box, Typography, Badge).
                </Typography>

            </Box>



            <Slider {...settings}>
                
                {dummyData.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%',marginLeft:1 }}>
                            <Grid container spacing={1} >
                                <Grid item xs={12} md={6}>
                                    <CardMedia
                                        component="img"
                                        image={item.imageUrl}
                                        alt={item.title}
                                        sx={{ width: '100%', height: { xs: 'auto', md: 220 }, objectFit: 'cover' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" sx={{
                                            fontFamily: 'Roboto, sans-serif',
                                            fontWeight: 900,

                                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


                                        }}  >
                                            {item.percentage}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{
                                            fontFamily: 'Roboto, sans-serif',
                                            fontWeight: 900,

                                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


                                        }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            fontFamily: 'Roboto, sans-serif',
                                            fontWeight: 600,

                     

                                        }}>
                                            {item.description}
                                        </Typography>
                                        <Grid container spacing={1} sx={{ marginTop: 1 }}>
                                            <Grid item>
                                                <IconButton aria-label="add to shopping cart" sx={{ color: 'red' }}>
                                                    <ShoppingCartIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <IconButton aria-label="compare" sx={{ color: 'red' }}>
                                                    <CompareIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <IconButton aria-label="visibility" sx={{ color: 'red' }}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            
            </Slider>
            </Box></Box>
    );
}