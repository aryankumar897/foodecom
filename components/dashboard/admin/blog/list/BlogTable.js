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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  PhotoLibrary as GalleryIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteBlog } from "@/slice/blogSlice";
import { useRouter } from "next/navigation";
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
} from "./productTableStyles"; //

const BlogTable = ({ blogs, onEdit }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleDeleteClick = (blogId) => {
    setBlogToDelete(blogId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteBlog(blogToDelete));
    setDeleteConfirmOpen(false);
    setBlogToDelete(null);
  };

  const handleSettingsClick = (event, blog) => {
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  const paginatedBlogs = blogs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Mobile view
  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedBlogs.map((blog) => (
          <Box key={blog._id} sx={mobileRowStyles}>
            <Box sx={{ ...mobileCellStyles, flexDirection: "column" }}>
              <img
                src={blog.thumb_image}
                alt={blog.title}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 1,
                  marginBottom: 4,
                }}
              />
              <Typography sx={mobileLabelStyles}>Title</Typography>
              <Typography>{blog.title}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Category</Typography>
              <Typography>{blog.category_id?.name || "-"}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Chip
                label={blog.status ? "Published" : "Draft"}
                size="small"
                sx={statusStyles(blog.status)}
              />
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(blog._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(blog._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(blogs.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        {/* Delete confirmation */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this blog? This action cannot be
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

  // Desktop view
  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="blogs table">
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <img
                    src={blog.thumb_image}
                    alt={blog.title}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.category_id?.name || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={blog.status ? "Published" : "Draft"}
                    size="small"
                    sx={statusStyles(blog.status)}
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(blog._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(blog._id)}
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
            count={Math.ceil(blogs.length / rowsPerPage)}
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
            Are you sure you want to delete this blog? This action cannot be
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

export default BlogTable;
