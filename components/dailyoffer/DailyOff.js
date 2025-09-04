// "use client"


// import React from 'react';
// import { Box,  Badge, Rating, Container } from '@mui/material';
// import { styled } from '@mui/system';
// import Slider from 'react-slick';

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import CompareIcon from '@mui/icons-material/Compare';
// import VisibilityIcon from '@mui/icons-material/Visibility';




// const dummyData = [
//     {
//         id: 1,
//         imageUrl: '/images/res1.jpg',
//         percentage: '50%',
//         title: 'Sample Title 1',
//         description: 'This is a sample description for item 1.'
//     },
//     {
//         id: 2,
//         imageUrl: '/images/res2.jpg',
//         percentage: '70%',
//         title: 'Sample Title 2',
//         description: 'This is a sample description for item 2.'
//     },
//     {
//         id: 1,
//         imageUrl: '/images/res3.jpg',
//         percentage: '50%',
//         title: 'Sample Title 1',
//         description: 'This is a sample description for item 1.'
//     },
//     {
//         id: 2,
//         imageUrl: '/images/res5.jpg',
//         percentage: '70%',
//         title: 'Sample Title 2',
//         description: 'This is a sample description for item 2.'
//     }
  
// ];



// export default function ClientSaid() {
//     const settings = {
//         dots: true,
//         infinite: false,
//         speed: 500,
//         slidesToShow: 3,
//         slidesToScroll: 3,
//         focusOnSelect: true,
//         initialSlide: 2,
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 3,
//                     slidesToScroll: 3,
//                     infinite: true,
//                     dots: true
//                 }
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                     initialSlide: 1
//                 }
//             },
//             {
//                 breakpoint: 480,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1
//                 }
//             }
//         ]
//     };

//     return (


//         <Box sx={{ backgroundColor: "#ffe6e6" }} p={10} >

//         <Box sx={{
//             margin: '0 auto',
//             width: '80%',
//             maxWidth: '1070px',
//         }}>

//             <Box textAlign="center" mt={14}

//                 sx={{
//                     margin: '0 auto',
//                     maxWidth: '600px',
//                 }}

//             >


//                     <Typography variant="body4" gutterBottom mt={14}
//                         sx={{
//                             fontFamily: 'Roboto, sans-serif',
//                             fontWeight: 600,
//  color:"red",
//                             textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


//                         }}


//                     >
//                        dailyoff
//                     </Typography>


//                 <Typography variant="h4" gutterBottom mt={1} 
//                         sx={{
//                             fontFamily: 'Roboto, sans-serif',
//                             fontWeight: 900,

//                             textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


//                         }}
                
                
//                  >
//                    Upto 90% off this day order now
//                 </Typography>
//                 <Typography variant="body2" gutterBottom 
//                         mb={4} 
//                         sx={{
//                             fontFamily: 'Roboto, sans-serif',
//                             fontWeight: 300,

//                             textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


//                         }}
                
                
                
//                   >

//                     Adjust the styles (sx props) and other properties
//                     (such as colors, padding, etc.) to fit your specific

//                     components from Material-UI (Box, Typography, Badge).
//                 </Typography>

//             </Box>



//             <Slider {...settings}>
                
//                 {dummyData.map((item) => (
//                     <Grid item xs={12} sm={6} md={4} key={item.id}>
//                         <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%',marginLeft:1 }}>
//                             <Grid container spacing={1} >
//                                 <Grid item xs={12} md={6}>
//                                     <CardMedia
//                                         component="img"
//                                         image={item.imageUrl}
//                                         alt={item.title}
//                                         sx={{ width: '100%', height: { xs: 'auto', md: 220 }, objectFit: 'cover' }}
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} md={6}>
//                                     <CardContent>
//                                         <Typography variant="h5" component="div" sx={{
//                                             fontFamily: 'Roboto, sans-serif',
//                                             fontWeight: 900,

//                                             textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


//                                         }}  >
//                                             {item.percentage}
//                                         </Typography>
//                                         <Typography variant="h6" component="div" sx={{
//                                             fontFamily: 'Roboto, sans-serif',
//                                             fontWeight: 900,

//                                             textShadow: '1px 1px 3px rgba(0,0,0,0.6)',


//                                         }}>
//                                             {item.title}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary" sx={{
//                                             fontFamily: 'Roboto, sans-serif',
//                                             fontWeight: 600,

                     

//                                         }}>
//                                             {item.description}
//                                         </Typography>
//                                         <Grid container spacing={1} sx={{ marginTop: 1 }}>
//                                             <Grid item>
//                                                 <IconButton aria-label="add to shopping cart" sx={{ color: 'red' }}>
//                                                     <ShoppingCartIcon />
//                                                 </IconButton>
//                                             </Grid>
//                                             <Grid item>
//                                                 <IconButton aria-label="compare" sx={{ color: 'red' }}>
//                                                     <CompareIcon />
//                                                 </IconButton>
//                                             </Grid>
//                                             <Grid item>
//                                                 <IconButton aria-label="visibility" sx={{ color: 'red' }}>
//                                                     <VisibilityIcon />
//                                                 </IconButton>
//                                             </Grid>
//                                         </Grid>
//                                     </CardContent>
//                                 </Grid>
//                             </Grid>
//                         </Card>
//                     </Grid>
//                 ))}
            
//             </Slider>
//             </Box></Box>
//     );
// }




















"use client";
import React, { useState, useEffect } from 'react';
import { Box, Badge, Rating, Container, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, CardMedia, Typography, Grid, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CompareIcon from '@mui/icons-material/Compare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
export default function DailyOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
const router =useRouter()
    // Fetch daily offers from API
    const fetchDailyOffers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.API}/daily-offers`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch daily offers');
            }
            
            const data = await response.json();
            // Filter only active offers
            const activeOffers = data.filter(offer => offer.status);
            setOffers(activeOffers);
        } catch (err) {
            setError(err.message || 'Failed to load daily offers');
            console.error('Error fetching daily offers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyOffers();
    }, []);

    const settings = {
        dots: true,
        infinite: offers.length > 2,
        speed: 500,
        slidesToShow: Math.min(2, offers.length),
        slidesToScroll: Math.min(2, offers.length),
        focusOnSelect: true,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, offers.length),
                    slidesToScroll: Math.min(2, offers.length),
                    infinite: offers.length > 2,
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
            <Box sx={{ backgroundColor: "#ffe6e6" }} p={10}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ backgroundColor: "#ffe6e6" }} p={10}>
                <Box sx={{ margin: '0 auto', width: '80%', maxWidth: '1070px' }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: "#ffe6e6" }} p={10}>
            <Box sx={{ margin: '0 auto', width: '80%', maxWidth: '1070px' }}>
                <Box textAlign="center" mt={14} sx={{ margin: '0 auto', maxWidth: '600px' }}>
                    <Typography variant="body1" gutterBottom mt={14}
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 600,
                            color: "red",
                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                        }}
                    >
                        DAILY OFFERS
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
                    
                    {offers.length === 0 ? (
                        <Typography variant="body2" gutterBottom mb={4}
                            sx={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 300,
                                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                            }}
                        >
                            No active daily offers at the moment. Check back later for special deals!
                        </Typography>
                    ) : (
                        <Typography variant="body2" gutterBottom mb={4}
                            sx={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 300,
                                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                            }}
                        >
                            Don't miss out on our exclusive daily deals. Limited time offers!
                        </Typography>
                    )}
                </Box>

                {offers.length > 0 ? (
                    <Slider {...settings}>
                        {offers.map((offer) => (
                            <Grid item xs={12} sm={6} md={4} key={offer._id} sx={{ px: 1 }}>
                                <Card sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', md: 'row' }, 
                                    height: '100%', 
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: 3
                                    }
                                }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <CardMedia
                                                component="img"
                                                image={offer.product_id?.thumb_image || '/images/placeholder-product.jpg'}
                                                alt={offer.product_id?.name}
                                                sx={{ 
                                                    width: '100%', 
                                                    height: { xs: 'auto', md: 220 }, 
                                                    objectFit: 'cover' 
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder-product.jpg';
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                                <Box>
                                                    <Badge 
                                                        badgeContent="SALE" 
                                                        color="error" 
                                                        sx={{ mb: 1 }}
                                                    >
                                                        <Typography variant="h5" component="div" 
                                                            sx={{
                                                                fontFamily: 'Roboto, sans-serif',
                                                                fontWeight: 900,
                                                                textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                                                            }}
                                                        >
                                                            {offer.discountPercentage || '50%'} OFF
                                                        </Typography>
                                                    </Badge>
                                                    <Typography variant="h6" component="div" 
                                                        sx={{
                                                            fontFamily: 'Roboto, sans-serif',
                                                            fontWeight: 900,
                                                            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                                                        }}
                                                    >
                                                        {offer.product_id?.name || 'Special Offer'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" 
                                                        sx={{
                                                            fontFamily: 'Roboto, sans-serif',
                                                            fontWeight: 600,
                                                            mt: 1,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {offer.product_id?.description || 'Limited time offer. Get it while it lasts!'}
                                                    </Typography>
                                                    {offer.product_id?.price && (
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                                                ${(offer.product_id?.offer_price).toFixed(2)}
                                                            </Typography>
                                                            <Typography variant="h6" color="error">
                                                                ${offer.product_id.price.toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
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
                                                        <IconButton
                                                        
                                                        onClick={()=>router.push(`/product/${offer.product_id?.slug}`)}
                                                        
                                                        aria-label="visibility" sx={{ color: 'red' }}>
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
                ) : (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            No daily offers available at the moment
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}