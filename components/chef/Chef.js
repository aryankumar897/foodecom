

"use client";
import React, { useEffect } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Container, CircularProgress} from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeChefs  } from '@/slice/chefSlice';

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

const ChefCard = ({ chef }) => {
    return (
        <StyledCard>
            <Box sx={{ margin: "auto" }}>
                <CircleImage
                    component="img"
                    image={chef.image || '/images/default-chef.jpg'}
                    alt={chef.name}
                    sx={{ marginTop: '60px' }}
                />
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', mt: 2 }}>
                    {chef.name}
                </Typography>
                <Typography variant="body2" component="div" sx={{ textAlign: 'center' }}>
                    {chef.title}
                </Typography>
            </Box>

            <Box sx={{ flex: '1 1 auto', padding: 1 }}>
                <CardContent sx={{ color: 'black', backgroundColor: 'white', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {chef.fb && (
                            <a href={chef.fb} target="_blank" rel="noopener noreferrer">
                                <Facebook sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                            </a>
                        )}
                        {chef.x && (
                            <a href={chef.x} target="_blank" rel="noopener noreferrer">
                                <Twitter sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                            </a>
                        )}
                        {chef.in && (
                            <a href={chef.in} target="_blank" rel="noopener noreferrer">
                                <Instagram sx={{ color: 'white', backgroundColor: 'red', borderRadius: '50%', padding: '5px' }} />
                            </a>
                        )}
                    </Box>
                </CardContent>
            </Box>
        </StyledCard>
    );
};

export default function ExpertChefs() {
    const dispatch = useDispatch();
    const {  homeChefs: chefs, loading } = useSelector((state) => state.chefs);

    useEffect(() => {
        dispatch(fetchHomeChefs());
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

    return (
        <Box sx={{
            margin: '0 auto',
            width: '80%',
            maxWidth: '1070px',
            py: 8
        }}>
            <Box textAlign="center" sx={{ margin: '0 auto', maxWidth: '600px' }}>
                <Typography
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        zIndex: 11111,
                        '&:hover': { transform: 'scale(1.1)' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                    variant="h4" gutterBottom
                >
                    Our Team
                </Typography>

                <Typography variant="h4" gutterBottom
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        zIndex: 11111,
                        '&:hover': { transform: 'scale(1.1)' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    Expert Chefs
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Meet our talented team of professional chefs
                </Typography>
            </Box>

            {loading ? (
                <Box textAlign="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Slider {...settings}>
                    {chefs.filter(chef => chef.status).map((chef) => (
                        <Box key={chef._id} sx={{ padding: 1 }}>
                            <ChefCard chef={chef} />
                        </Box>
                    ))}
                </Slider>
            )}
        </Box>
    );
}