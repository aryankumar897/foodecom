"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
  Rating,
  Avatar,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const AdminReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/admin/reviews`);

        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        } else {
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Update review status
  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(
        `${process.env.API}/admin/reviews/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        // Update local state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId ? { ...review, status: newStatus } : review
          )
        );
        setSuccess("Review status updated successfully");
      } else {
        setError("Failed to update review status");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedReview(null);
  };

  const getStatusChip = (status) => {
    let color, label;

    switch (status) {
      case false:
        color = "warning";
        label = "Pending";
        break;
      case true:
        color = "success";
        label = "Approved";
        break;
     
    }

    return <Chip label={label} color={color} size="small" />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mobile card view
  const renderMobileCard = (review) => (
    <Card key={review._id} sx={{ mb: 2, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            User: {review.user_id?.name || "Unknown"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Product: {review.product_id?.name || "Unknown Product"}
          </Typography>
        </Box>
        {getStatusChip(review.status)}
      </Box>

      <Box mb={1}>
        <Rating value={review.rating} readOnly size="small" />
      </Box>

      <Typography variant="body2" sx={{ mb: 2 }}>
        {review.review.length > 100
          ? `${review.review.substring(0, 100)}...`
          : review.review}
      </Typography>

      <Typography
        variant="caption"
        color="textSecondary"
        display="block"
        mb={2}
      >
        {formatDate(review.createdAt)}
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <IconButton
          size="small"
          onClick={() => handleViewReview(review)}
          color="primary"
        >
          <ViewIcon />
        </IconButton>

        <Select
          value={review.status}
          onChange={(e) => updateReviewStatus(review._id, e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
          disabled={updating}
        >
          <MenuItem value={false}>Pending</MenuItem>
          <MenuItem value={true}>Approved</MenuItem>
        </Select>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Review Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {isMobile ? (
        // Mobile view
        <Box>
          {reviews.length === 0 ? (
            <Typography variant="body1" textAlign="center" sx={{ py: 4 }}>
              No reviews found.
            </Typography>
          ) : (
            reviews.map(renderMobileCard)
          )}
        </Box>
      ) : (
        // Desktop table view
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }} aria-label="reviews table">
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Review</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No reviews found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 1,
                            bgcolor: theme.palette.primary.main,
                          }}
                        >
                          {review.user_id?.name?.charAt(0) || "U"}
                        </Avatar>
                        {review.user_id?.name || "Unknown User"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {review.product_id?.name || "Unknown Product"}
                    </TableCell>
                    <TableCell>
                      <Rating value={review.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {review.review.length > 100
                        ? `${review.review.substring(0, 100)}...`
                        : review.review}
                    </TableCell>
                    <TableCell>{formatDate(review.createdAt)}</TableCell>
                    <TableCell>{getStatusChip(review.status)}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewReview(review)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>

                        <Select
                          value={review.status}
                          onChange={(e) =>
                            updateReviewStatus(review._id, e.target.value)
                          }
                          size="small"
                          sx={{ minWidth: 120 }}
                          disabled={updating}
                        >
                          <MenuItem value={false}>Pending</MenuItem>
                          <MenuItem value={true}>Approved</MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Review Detail Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User
                  </Typography>
                  <Typography variant="body1">
                    {selectedReview.user_id?.name || "Unknown"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Product
                  </Typography>
                  <Typography variant="body1">
                    {selectedReview.product_id?.name || "Unknown Product"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Rating
                  </Typography>
                  <Rating value={selectedReview.rating} readOnly />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  {getStatusChip(selectedReview.status)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Submitted On
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedReview.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedReview.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" color="textSecondary">
                Review
              </Typography>
              <Card
                variant="outlined"
                sx={{ p: 2, mt: 1, backgroundColor: theme.palette.grey[50] }}
              >
                <Typography variant="body1">{selectedReview.review}</Typography>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReviewsDashboard;
