"use client"
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/system';
import MapIcon from '@mui/icons-material/Map';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';


const ContactBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffcccc',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const ContactIcon = styled(Box)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));


const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ff531a', // Custom border color
        },
        '&:hover fieldset': {
            borderColor: '#ff531a', // Custom border color on hover
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff531a', // Custom border color when focused
        },
    },
}));

export default function Contact() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required.";
        if (!formData.email) {
            tempErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is not valid.";
        }
        if (!formData.message) tempErrors.message = "Message is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setSuccess(true);
                    setFormData({
                        name: '',
                        email: '',
                        message: ''
                    });
                } else {
                    setSuccess(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setSuccess(false);
            }
        }
    };




    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Contact Us
            </Typography>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <PhoneIcon style={{ color: "red", }} />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">(123) 456-7890</Typography>
                </Grid>
            </ContactBox>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <LocationOnIcon style={{ color: "red", }} />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">1234 Elm St, Some City, ST 56789</Typography>
                </Grid>
            </ContactBox>

            <ContactBox>
                <Grid item xs={1}>
                    <ContactIcon>
                        <EmailIcon style={{ color: "red", }} />
                    </ContactIcon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="body1">contact@yourdomain.com</Typography>
                </Grid>
            </ContactBox>

            <Box component="form"
            
            
             noValidate autoComplete="off" onSubmit={handleSubmit}>
                {success && <Alert severity="success">Message sent successfully!</Alert>}
                <CustomTextField
                    fullWidth
                    id="name"
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle style={{ color: "red", }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <CustomTextField
                    fullWidth
                    id="email"
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon style={{ color: "red", }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <CustomTextField
                    fullWidth
                    id="message"
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                />
                <Button
                    sx={{
                        backgroundColor: 'red',
                        color: "white",
                        '&:hover': {
                            backgroundColor: 'darkred',
                            border: 'darkred',
                        },
                    }}
                    variant="contained"
                    fullWidth
                    type="submit"
                >
                    Send
                </Button>
            </Box>
            <Grid item xs={12}>
                <IconButton aria-label="Google Map">
                    <MapIcon />
                </IconButton>
                <Typography variant="body2">View on Google Map</Typography>

                <Box sx={{ height: 200, border: '1px solid #ccc', marginTop: 2 }}>
                    <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="100%" frameBorder="0" style={{ border: 0 }} allowFullScreen aria-hidden="false" tabIndex="0"></iframe>

                </Box>


            </Grid>




        </Container>
    );
}
