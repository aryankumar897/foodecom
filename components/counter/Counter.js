"use client"
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CountUp from 'react-countup';

const IndexPage = () => {
    const totalCustomers = 100; // You can fetch this value from your data source
    const totalCategories = 10; // Example value for total categories
    const totalListings = 500; // Example value for total listings
    const totalteam = 1000;
    return (
        <div style={{
            backgroundImage: `url(./images/res1.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px',
        }}>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={3}>
                    <Box textAlign="center" color="white" fontSize="2rem" fontWeight="bold">
                        <CountUp end={totalCustomers} duration={3} />
                        <Typography variant="body1"> Happy Customers</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Box textAlign="center" color="white" fontSize="2rem" fontWeight="bold">
                        <CountUp end={totalCategories} duration={3} />
                        <Typography variant="body1">experianced chef</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Box textAlign="center" color="white" fontSize="2rem" fontWeight="bold">
                        <CountUp end={totalListings} duration={3} />
                        <Typography variant="body1">customere serve</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Box textAlign="center" color="white" fontSize="2rem" fontWeight="bold">
                        <CountUp end={totalteam} duration={3} />
                        <Typography variant="body1">Total awawerd</Typography>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default IndexPage;
