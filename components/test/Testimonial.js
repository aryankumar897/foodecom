"use client";
import React, { useEffect } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Rating, Container } from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeTestimonials } from '@/slice/testimonialSlice';

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
            <Box sx={{ margin:"auto"}}>
                <CircleImage
                    component="img"
                    image={post.image}
                    alt={post.name}
                    sx={{ marginTop: '60px', }}
                />
                <Typography variant="h6" component="div" sx={{ marginLeft: '100px', }}>
                    {post.name}
                </Typography>
                <Typography variant="body2" component="div" sx={{ marginLeft: '110px', }}>
                    {post.title}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 auto', padding: 3 }} >
                {post.review}
            </Typography>
            <Box sx={{ flex: '1 1 auto', padding: 1 }}>
                <CardContent sx={{ color: 'black', backgroundColor: 'white', textAlign: 'center' }}>
                    <Rating name="read-only" value={post.rating} readOnly sx={{ mr: 9 }} />
                </CardContent>
            </Box>
        </StyledCard>
    );
};

export default function ClientSaid() {
    const dispatch = useDispatch();
    const { homeTestimonials, loading, error } = useSelector((state) => state.testimonials);

    useEffect(() => {
        dispatch(fetchHomeTestimonials());
    }, [dispatch]);

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

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 14 }}>
                <Typography variant="h4">Loading testimonials...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 14 }}>
                <Typography variant="h4" color="error">Error loading testimonials</Typography>
            </Box>
        );
    }

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
                    variant="h4" gutterBottom mt={14}
                >
                    Testimonials
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
                    Our Customer Feedback
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    See what our satisfied customers have to say about our services
                </Typography>
            </Box>

            {homeTestimonials && homeTestimonials.length > 0 ? (
                <Slider {...settings}>
                    {homeTestimonials.map((testimonial, index) => (
                        <Box key={testimonial._id || index} sx={{ padding: 1 }}>
                            <PostCard post={testimonial} />
                        </Box>
                    ))}
                </Slider>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No testimonials available</Typography>
                </Box>
            )}
        </Box>
    );
}