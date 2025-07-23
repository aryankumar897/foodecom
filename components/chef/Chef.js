"use client"
import React from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Badge, Rating, Container } from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledCard = styled(Card)({
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease-in-out',
    },
    maxWidth: 954,
    margin: '1rem',
});



const CircleImage = styled(CardMedia)({
    borderRadius: '50%',
    width: '120px',
    height: '120px',
    margin: '0 auto',
});

const PostCard = ({ post }) => {
    return (
        <StyledCard>
            <Box sx={{ margin: "auto" }}>

                <CircleImage
                    component="img"
                    image={post.imageUrl}
                    alt={post.title}
                    sx={{ marginTop: '60px', }}
                />
                <Typography variant="h6" component="div" sx={{ marginLeft: '100px', }}>
                    {post.title}
                </Typography>

                <Typography variant="body2" component="div" sx={{ marginLeft: '110px', }}>
                    {post.title}
                </Typography>


            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 auto', padding: 3 }} >
                {post.location}
            </Typography>
            <Box sx={{ flex: '1 1 auto', padding: 1 }}>
                <CardContent sx={{ color: 'black', backgroundColor: 'white', textAlign: 'center' }}>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Facebook sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                        <Twitter sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                        <Instagram sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                    </Box>
                </CardContent>
            </Box>
        </StyledCard>
    );
};

const dummyPosts = [
    {
        title: "Beautiful Mountain View",

        rating: 4.5,
        location: "his his setup should give you a layout where each slide setup should give you a layout where each slide ",
        imageUrl: "/images/res12.jpg",
    },
    {
        title: "Sunny Beach",

        rating: 4.8,
        location: "hishis setup should give you a layout where each slide  setup should give you a layout where each slide ",
        imageUrl: "/images/res13.jpg",
    },
    {
        title: "City Lights",

        rating: 4.2,
        location: "hishis setup should give you a layout where each slide  setup should give you a layout where each slide ",
        imageUrl: "/images/res12.jpg",
    },
  
];

export default function ClientSaid() {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        focusOnSelect: true,
        initialSlide: 0,
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
                <Typography
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,

                        zIndex: 11111,
                        '&:hover': {

                            transform: 'scale(1.1)',

                        },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',

                        transition: 'transform 0.3s ease-in-out',





                    }}


                    variant="h4" gutterBottom mt={14}  >
                  our team
                </Typography>



                <Typography variant="h4" gutterBottom mt={1}
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,

                        zIndex: 11111,
                        '&:hover': {

                            transform: 'scale(1.1)',

                        },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',

                        transition: 'transform 0.3s ease-in-out',





                    }}


                >
                   Expert chef
                </Typography>
                <Typography variant="subtitle1" gutterBottom>

                    Adjust the styles (sx props) and other properties
                    (such as colors, padding, etc.) to fit your specific

                    
                </Typography>

            </Box>



            <Slider {...settings}>
                {dummyPosts.map((post, index) => (
                    <Box key={index} sx={{ padding: 1 }}>
                        <PostCard post={post} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}