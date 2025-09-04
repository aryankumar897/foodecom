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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteChef } from "@/slice/chefSlice";
import {
  tableContainerStyles,
  tableStyles,
  responsiveCellStyles,
  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./chefTableStyles";

const ChefTable = ({ chefs, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [chefToDelete, setChefToDelete] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (chefId) => {
    setChefToDelete(chefId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteChef(chefToDelete));
    setDeleteConfirmOpen(false);
    setChefToDelete(null);
  };

  const paginatedChefs = chefs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedChefs.map((chef) => (
          <Box key={chef._id} sx={mobileRowStyles}>
            <Box sx={{ ...mobileCellStyles, alignItems: "center", gap: 2 }}>
              <Avatar src={chef.image} alt={chef.name} />
              <Box>
                <Typography fontWeight="bold">{chef.name}</Typography>
                <Typography variant="body2">{chef.title}</Typography>
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(chef.status)}>
                {chef.status ? "Active" : "Inactive"}
                {chef.show_at_home && (
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
                onClick={() => onEdit(chef._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(chef._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(chefs.length / rowsPerPage)}
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
              Are you sure you want to delete this chef? This action cannot be
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
        <Table sx={tableStyles} aria-label="chefs table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Show at Home</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedChefs.map((chef) => (
              <TableRow key={chef._id}>
                <TableCell>
                  <Avatar src={chef.image} alt={chef.name} />
                </TableCell>
                <TableCell>{chef.name}</TableCell>
                <TableCell>{chef.title}</TableCell>
                <TableCell>
                  <Box sx={statusStyles(chef?.status)}>
                    {chef.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label={chef.show_at_home ? "Yes" : "No"}
                    size="small"
                    sx={statusStyles(chef?.show_at_home)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(chef._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(chef._id)}
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
            count={Math.ceil(chefs.length / rowsPerPage)}
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
            Are you sure you want to delete this chef? This action cannot be
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

export default ChefTable;