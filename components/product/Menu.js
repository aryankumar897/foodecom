'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import { useMediaQuery, IconButton, Tooltip, Grid, Box, Card, CardMedia, CardContent, Typography, Badge, Rating, Container } from '@mui/material';
import { styled } from '@mui/system';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CompareIcon from '@mui/icons-material/Compare';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Model from "./Model"
import SaveAsIcon from '@mui/icons-material/SaveAs';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from '@mui/material/Modal';
import Search  from  "./Search"


const StyledCard = styled(Card)({
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease-in-out',
    },
    maxWidth: 251,
  

   


});

const StyledBadge = styled(Badge)({
    position: 'absolute',
    top: 170,
    left: 200,
    zIndex: 221,
    color: 'white',

    padding: '4px 8px',
    borderRadius: '4px',
});


const StyledsBadge = styled(Badge)({
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 221,
    color: 'white',

    padding: '4px 8px',
    borderRadius: '4px',

});


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    outline: 'none',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh', // Set maximum height for the modal
    overflowY: 'auto'
};
const modalContentStyle = {
    outline: '2px solid red',

    borderRadius: '8px',
    bgcolor: 'background.paper',
    p: 2,
};

const PostCard = ({ post }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (

        <>


            <StyledCard>
                <Box sx={{ position: 'relative',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    
                    alignItems: { sm: 'center' },
             
                
                
                
                
                 }}>

                    <Box >


                        <StyledsBadge badgeContent={post.categories} sx={{ "& .MuiBadge-badge": { backgroundColor: "red", } }} />

                    </Box>


                    <StyledBadge badgeContent={post.price} sx={{ "& .MuiBadge-badge": { backgroundColor: "red", fontSize: ".8rem" } }} />


                    <CardMedia
                        component="img"
                        height="100"
                        image={post.imageUrl}
                        alt={post.title}
                    />
                </Box>
                <CardContent sx={{ color: 'black', backgroundColor: 'white' }}>
                    <Box

                        display="flex"
                        justifyContent="center"
                        alignItems="center"

                    >


                        <Typography gutterBottom variant="h6" component="div">
                            {post.title}
                        </Typography>

                    </Box>

                    <Box

                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        ml={4}
                    >
                        <Grid container sx={{ marginLeft: 1 }}>
                            <Grid item>
                                <IconButton
                                    onClick={handleOpen}

                                    aria-label="add to shopping cart" sx={{ color: 'red' }}>
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

                    </Box>

                </CardContent>


                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                        <Box sx={modalContentStyle}>
                            <Model />
                        </Box>
                    </Box>
                </Modal>
            </StyledCard>



        </>

    );
};

const dummyPosts = [
    {
        title: "Beautiful Mountain View",
        categories: "Travel",
        rating: 4.5,
        location: "Swiss Alps",
        imageUrl: "/images/res1.jpg",
        price: "$90"
    },
    {
        title: "Sunny Beach",
        categories: "Vacation",
        rating: 4.8,
        location: "Maldives",
        imageUrl: "/images/res2.jpg",
        price: "$80"
    },
    {
        title: "City Lights",
        categories: "Cityscape",
        rating: 4.2,
        location: "New York",
        imageUrl: "/images/res3.jpg",
        price: "$10"
    },
    {
        title: "Serene Forest",
        categories: "Nature",
        rating: 4.6,
        location: "Amazon",
        imageUrl: "/images/res4.jpg",
        price: "$40"
    },
    {
        title: "Desert Adventure",
        categories: "Adventure",
        rating: 4.7,
        location: "Sahara",
        imageUrl: "/images/res5.jpg",
        price: "$90"
    }, {
        title: "Beautiful Mountain View",
        categories: "Travel",
        rating: 4.5,
        location: "Swiss Alps",
        imageUrl: "/images/res1.jpg",
        price: "$90"
    },
    {
        title: "Sunny Beach",
        categories: "Vacation",
        rating: 4.8,
        location: "Maldives",
        imageUrl: "/images/res2.jpg",
        price: "$80"
    },
    {
        title: "City Lights",
        categories: "Cityscape",
        rating: 4.2,
        location: "New York",
        imageUrl: "/images/res3.jpg",
        price: "$10"
    },
    {
        title: "Serene Forest",
        categories: "Nature",
        rating: 4.6,
        location: "Amazon",
        imageUrl: "/images/res4.jpg",
        price: "$40"
    },
    {
        title: "Desert Adventure",
        categories: "Adventure",
        rating: 4.7,
        location: "Sahara",
        imageUrl: "/images/res5.jpg",
        price: "$90"
    },
];

export default function Listings() {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    return (
        <Box sx={{
            margin: '0 auto',
            width: '80%',
            maxWidth: '1070px',
       
       
        }}>

        

     
            <Search/>


            <Grid container spacing={3}>



                <Grid item xs={12} md={12}>

                    <Grid container spacing={1}>

                        {dummyPosts.map((post, index) => (
                            <Box key={index} sx={{ padding: 1 ,
                            
                              
                            
                            }}>
                                <PostCard post={post} />
                            </Box>
                        ))}


                    </Grid>

                </Grid>
            </Grid>






        </Box>
    );
}
