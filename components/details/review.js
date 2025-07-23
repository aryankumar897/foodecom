"use client"

import { useState } from 'react';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Snackbar } from '@mui/material';
import { styled } from '@mui/system';

const LeftContainer = styled(Grid)({
    padding: '20px',
    borderRight: '1px solid #ccc',
});

const ReviewsAndFeedback = () => {
    const [reviews, setReviews] = useState([
        { id: 1, review: 'Great product!' },
        { id: 2, review: 'Could be better.' },
        // Add more reviews as needed
    ]);

    const [rating, setRating] = useState('');
    const [message, setMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleSuccessClose = () => {
        setSuccessOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple form validation
        if (!rating || !message.trim()) {
            setAlertOpen(true);
            return;
        }

        // Handle form submission logic here (e.g., send data to backend, etc.)
        console.log('Rating:', rating);
        console.log('Message:', message);

        // Reset form fields
        setRating('');
        setMessage('');

        // Display success message
        setSuccessOpen(true);
    };

    return (
        <Grid container spacing={3}>
            <LeftContainer item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>Reviews</Typography>
                {reviews.length === 0 ? (
                    <Typography variant="body1">No reviews found.</Typography>
                ) : (
                    reviews.map(review => (
                        <Typography key={review.id} variant="body1" gutterBottom>{review.review}</Typography>
                    ))
                )}
            </LeftContainer>
            <Grid item xs={12} md={6} sx={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>Give Feedback</Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                        <InputLabel id="rating-label">Rating</InputLabel>
                        <Select
                            labelId="rating-label"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            label="Rating"
                            error={!rating}
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <MenuItem key={num} value={num}>{num}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        error={!message.trim()}
                        helperText={!message.trim() && "Message cannot be empty"}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button 
                    
                    
                        sx={{
                            mt: 2,
                            color: 'white',
                            borderColor: 'red',
                            fontWeight: 600,
                            backgroundColor: 'red',
                            px: 4,
                            py: 1,
                            zIndex: 11111,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                borderColor: 'red',
                                color: 'red',
                            },
                        }}
                    
                    type="submit" variant="contained"  fullWidth>
                        Send Message
                    </Button>
                </form>
            </Grid>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                message="Please fill out all fields."
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
            <Snackbar
                open={successOpen}
                autoHideDuration={6000}
                onClose={handleSuccessClose}
                message="Feedback submitted successfully!"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Grid>
    );
};

export default ReviewsAndFeedback;
