"use client";

import React, { useState, useEffect } from "react";
import {
    CircularProgress,
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
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const ReservationTable = () => {




  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const rowsPerPage = 5;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.API}/admin/reservations`);
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Update reservation status
  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`${process.env.API}/admin/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedReservation = await response.json();
      setReservations(prev =>
        prev.map(res =>
          res._id === reservationId ? updatedReservation : res
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteClick = (reservationId) => {
    setReservationToDelete(reservationId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/reservations/${reservationToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete reservation");

      setReservations(prev =>
        prev.filter(res => res._id !== reservationToDelete)
      );
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const paginatedReservations = reservations.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isSmallScreen) {
    return (
      <Box sx={{ p: 2 }}>
        {paginatedReservations.map((reservation) => (
          <Paper key={reservation._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">
              {reservation.name} - {reservation.phone}
            </Typography>
            <Typography>
              {formatDate(reservation.date)} at
              
                   {reservation.time.start_time}----
 {reservation.time.end_time}



            
            </Typography>
            <Typography>Persons: {reservation.persons}</Typography>
            <Select
              value={reservation.status}
              onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
              size="small"
              fullWidth
              sx={{ mt: 1 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(reservation._id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
        <Pagination
          count={Math.ceil(reservations.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Persons</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReservations.map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>{reservation.name}</TableCell>
                <TableCell>{reservation.phone}</TableCell>
                <TableCell>{formatDate(reservation.date)}</TableCell>
                <TableCell>
                    
                    {reservation.time.start_time}_____
 {reservation.time.end_time}


                </TableCell>
                <TableCell>{reservation.persons}</TableCell>
                <TableCell>
                  <Select
                    value={reservation.status}
                    onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(reservation._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(reservations.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reservation? This action cannot be
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

export default ReservationTable;