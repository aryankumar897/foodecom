"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
  Rating,
  Box,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Divider,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSession } from "next-auth/react";

// Styled components
const LeftContainer = styled(Grid)({
  padding: "20px",
  borderRight: "1px solid #e0e0e0",
  maxHeight: "500px",
  overflowY: "auto",
  backgroundColor: "#fafafa",
  borderRadius: "8px",
});

const ReviewCard = styled(Card)({
  marginBottom: "15px",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },
});

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#1976d2",
  },
});

const SubmitButton = styled(Button)({
  marginTop: "16px",
  color: "white",
  fontWeight: 600,
  backgroundColor: "#1976d2",
  padding: "10px 24px",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
  "&:disabled": {
    backgroundColor: "#bdbdbd",
  },
});

const ReviewsAndFeedback = ({ product }) => {
  const product_id = product?._id || "default-product-id";
  const { data: session } = useSession();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.API}/user/product-rating?product_id=${product_id}`
        );

        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        } else {
          console.error("Failed to fetch reviews");
          setErrorMessage("Failed to load reviews. Please try again.");
          setAlertOpen(true);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setErrorMessage("Network error. Please try again.");
        setAlertOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [product_id]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setErrorMessage("Please sign in to submit a review");
      setAlertOpen(true);
      return;
    }

    if (rating === 0 || !message.trim()) {
      setErrorMessage("Please provide both a rating and a review message");
      setAlertOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.API}/user/product-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          review: message,
          product_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new review to the list (with pending status)
        setReviews([data.review, ...reviews]);
        setRating(0);
        setMessage("");
        setSuccessOpen(true);
      } else {
        setErrorMessage(data.error || "Failed to submit review");
        setAlertOpen(true);
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter reviews based on status
  const approvedReviews = reviews.filter((review) => review.status === true);
  const pendingReviews = reviews.filter((review) => review.status === false);

  const renderReviews = (reviewList) =>
    reviewList.length === 0 ? (
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ py: 2, textAlign: "center" }}
      >
        No reviews to display.
      </Typography>
    ) : (
      reviewList.map((review) => (
        <ReviewCard key={review._id} elevation={0}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "#1976d2" }}>
                {review.user_id?.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.user_id?.name || "Anonymous"}
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <StyledRating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="textSecondary" ml={1}>
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {review.review}
            </Typography>
            {review.status === false && (
              <Chip
                label="Pending Approval"
                size="small"
                color="warning"
                sx={{ mt: 1 }}
              />
            )}
          </CardContent>
        </ReviewCard>
      ))
    );

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Customer Reviews
      </Typography>

      <Grid container spacing={4}>
        <LeftContainer item xs={12} md={7}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label={`Approved (${approvedReviews.length})`} />
              <Tab label={`Pending (${pendingReviews.length})`} />
            </Tabs>
          </Box>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {activeTab === 0
                ? renderReviews(approvedReviews)
                : renderReviews(pendingReviews)}
            </Box>
          )}
        </LeftContainer>

        <Grid item xs={12} md={5}>
          <Box sx={{ p: 3, backgroundColor: "#fafafa", borderRadius: "8px" }}>
            <Typography variant="h5" gutterBottom>
              Write a Review
            </Typography>

            {!session ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please sign in to leave a review for this product.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <Typography component="legend" variant="body1" gutterBottom>
                    Your Rating *
                  </Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(e, newValue) => {
                      setRating(newValue);
                    }}
                    size="large"
                  />
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Your Review *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  error={!message.trim() && isSubmitting}
             
                  helperText={
                    !message.trim() && isSubmitting
                      ? "Review cannot be empty"
                      : "Share your experience with this product"
                  }
                  sx={{ marginBottom: 2 }}
                />

                <SubmitButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                    sx={{
                mt: 2,
                color: "white",
                fontWeight: 600,
                backgroundColor: "red",
                px: 4,
                py: 1,
                "&:hover": {
                  backgroundColor: "darkred",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </SubmitButton>
              </form>
            )}
          </Box>

          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Review Guidelines
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Be specific about your experience with the product
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Focus on the product's features and performance
            </Typography>
            <Typography variant="body2">
              • Reviews will be approved within 24 hours
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Review submitted successfully! It will be visible after approval.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewsAndFeedback;
