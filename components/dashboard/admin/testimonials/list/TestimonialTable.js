
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
  Avatar,
  Rating,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteTestimonial } from "@/slice/testimonialSlice";
import {
  tableContainerStyles,
  tableStyles,

  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./testimonialTableStyles";

const TestimonialTable = ({ testimonials, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (testimonialId) => {
    setTestimonialToDelete(testimonialId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTestimonial(testimonialToDelete));
    setDeleteConfirmOpen(false);
    setTestimonialToDelete(null);
  };

  const paginatedTestimonials = testimonials.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedTestimonials.map((testimonial) => (
          <Box key={testimonial._id} sx={mobileRowStyles}>
            <Box sx={{ ...mobileCellStyles, alignItems: "center", gap: 2 }}>
              <Avatar src={testimonial.image} alt={testimonial.name} />
              <Box>
                <Typography fontWeight="bold">{testimonial.name}</Typography>
                <Typography variant="body2">{testimonial.title}</Typography>
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Rating</Typography>
              <Rating
                value={testimonial.rating}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" />}
              />
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(testimonial.status)}>
                {testimonial.status ? "Active" : "Inactive"}
                {testimonial.show_at_home && (
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label="Home"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(testimonial._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(testimonial._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(testimonials.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this testimonial? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="testimonials table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Show at Home</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTestimonials.map((testimonial) => (
              <TableRow key={testimonial._id}>
                <TableCell>
                  <Avatar src={testimonial.image} alt={testimonial.name} />
                </TableCell>
                <TableCell>{testimonial.name}</TableCell>
                <TableCell>{testimonial.title}</TableCell>
                <TableCell>
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    size="small"
                    icon={<StarIcon fontSize="inherit" />}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={statusStyles(testimonial?.status)}>
                    {testimonial.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label={testimonial.show_at_home ? "Yes" : "No"}
                    size="small"
                    sx={statusStyles(testimonial?.show_at_home)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(testimonial._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(testimonial._id)}
                    sx={{ ...actionButtonStyles, color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(testimonials.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this testimonial? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TestimonialTable;
