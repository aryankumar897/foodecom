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
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteBanner } from "@/slice/bannerSlice";
import {
  tableContainerStyles,
  tableStyles,
  statusStyles,
  paginationStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileCellStyles,
  mobileLabelStyles,
} from "./bannerTableStyles"; // create styles similar to testimonialTableStyles

const BannerTable = ({ banners, onEdit }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (bannerId) => {
    setBannerToDelete(bannerId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteBanner(bannerToDelete));
    setDeleteConfirmOpen(false);
    setBannerToDelete(null);
  };

  const paginatedBanners = banners.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedBanners.map((banner) => (
          <Box key={banner._id} sx={mobileRowStyles}>
            <Box sx={{ ...mobileCellStyles, alignItems: "center", gap: 2 }}>
              <Avatar src={banner.banner} alt={banner.title} />
              <Box>
                <Typography fontWeight="bold">{banner.title}</Typography>
                <Typography variant="body2">{banner.sub_title}</Typography>
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>URL</Typography>
              <Typography>{banner.url}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(banner.status)}>
                {banner.status ? "Active" : "Inactive"}
              </Box>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(banner._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(banner._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(banners.length / rowsPerPage)}
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
              Are you sure you want to delete this banner? This action cannot be
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
        <Table sx={tableStyles} aria-label="banners table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBanners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <Avatar src={banner.banner} alt={banner.title} />
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.sub_title}</TableCell>
                <TableCell>{banner.url}</TableCell>
                <TableCell>
                  <Box sx={statusStyles(banner.status)}>
                    {banner.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(banner._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(banner._id)}
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
            count={Math.ceil(banners.length / rowsPerPage)}
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
            Are you sure you want to delete this banner? This action cannot be
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

export default BannerTable;
