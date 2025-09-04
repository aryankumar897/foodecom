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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteReservationTime } from "@/slice/reservationTimeSlice";
import {
  tableContainerStyles,
  tableStyles,

  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./reservationTimeTableStyles";

const ReservationTimeTable = ({ times, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [timeToDelete, setTimeToDelete] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (timeId) => {
    setTimeToDelete(timeId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteReservationTime(timeToDelete));
    setDeleteConfirmOpen(false);
    setTimeToDelete(null);
  };

 
  const paginatedTimes = times.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedTimes.map((time) => (
          <Box key={time._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Time Slot</Typography>
              <Typography>
                {time.start_time} - {time.end_time}
              </Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(time.status)}>
                {time.status ? "Active" : "Inactive"}
                <Chip
                  icon={<TimeIcon fontSize="small" />}
                  label="Time"
                  size="small"
                />
              </Box>
            </Box>
            <Box sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(time._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(time._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(times.length / rowsPerPage)}
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
              Are you sure you want to delete this time slot? This action cannot be
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
        <Table sx={tableStyles} aria-label="time slots table">
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTimes.map((time) => (
              <TableRow key={time._id}>
                <TableCell>{time.start_time}</TableCell>
                <TableCell>{time.end_time}</TableCell>
                <TableCell>
                  <Box sx={statusStyles(time.status)}>
                    {time.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(time._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(time._id)}
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
            count={Math.ceil(times.length / rowsPerPage)}
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
            Are you sure you want to delete this time slot? This action cannot be
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

export default ReservationTimeTable;