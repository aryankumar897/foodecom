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
  Straighten as SizeIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteProduct } from "@/slice/productSlice";
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
  priceStyles,
  discountPriceStyles,
} from "./productTableStyles";





const ProductTable = ({ products, onEdit }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct(productToDelete));
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleSettingsClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleSizeManagement = () => {
    if (selectedProduct) {
      router.push(`/dashboard/admin/product/sizes/${selectedProduct._id}`);
      handleSettingsClose();
    }
  };

  const handleImageGallery = () => {
    if (selectedProduct) {
      router.push(`/dashboard/admin/product/gallery/${selectedProduct._id}`);
      handleSettingsClose();
    }
  };




 const handleProductOption=()=>{
if (selectedProduct) {
      router.push(`/dashboard/admin/product/option/${selectedProduct._id}`);
      handleSettingsClose();
    }

 }


  const paginatedProducts = products.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedProducts.map((product) => (
          <Box key={product._id} sx={mobileRowStyles}>
            <Box sx={{ ...mobileCellStyles, flexDirection: 'column' }}>
              <img 
                src={product.thumb_image} 
                alt={product.name}
                style={{ 
                  width: 60, 
                  height: 60, 
                  objectFit: 'cover',
                  borderRadius: 1,
                  marginBottom: 1
                }}
              />
              <Typography sx={mobileLabelStyles}>Name</Typography>
              <Typography>{product.name}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Price</Typography>
              {product.offer_price ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={discountPriceStyles}>
                    ${product.offer_price}
                  </Typography>
                  <Typography sx={{ ...priceStyles, ml: 1 }}>
                    ${product.price}
                  </Typography>
                </Box>
              ) : (
                <Typography sx={priceStyles}>
                  ${product.price}
                </Typography>
              )}
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Chip
                label={product.status ? "Active" : "Inactive"}
                size="small"
                sx={statusStyles(product.status)}
              />
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={(e) => handleSettingsClick(e, product)}
                sx={actionButtonStyles}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onEdit(product._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(product._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(products.length / rowsPerPage)}
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
              Are you sure you want to delete this product? This action cannot be
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

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSettingsClose}
        >
          <MenuItem onClick={handleSizeManagement}>
            <ListItemIcon>
              <SizeIcon fontSize="small" />
            </ListItemIcon>
            Size Management
          </MenuItem>
          <MenuItem onClick={handleImageGallery}>
            <ListItemIcon>
              <GalleryIcon fontSize="small" />
            </ListItemIcon>
            Image Gallery
          </MenuItem>

<MenuItem onClick={handleProductOption}>
            <ListItemIcon>
              <GalleryIcon fontSize="small" />
            </ListItemIcon>
           Product Options
          </MenuItem>

        </Menu>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Show at Home</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img 
                    src={product.thumb_image} 
                    alt={product.name}
                    style={{ 
                      width: 50, 
                      height: 50, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category_id?.name || '-'}</TableCell>
                <TableCell>
                  {product.offer_price ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={discountPriceStyles}>
                        ${product.offer_price}
                      </Typography>
                      <Typography sx={{ ...priceStyles, ml: 1 }}>
                        ${product.price}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={priceStyles}>
                      ${product.price}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.status ? "Active" : "Inactive"}
                    size="small"
                    sx={statusStyles(product.status)}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.show_at_home ? "Yes" : "No"}
                    size="small"
                    sx={statusStyles(product.show_at_home)}
                  />
                </TableCell>
                <TableCell align="right">
                  
                  <IconButton
                    size="small"
                    onClick={(e) => handleSettingsClick(e, product)}
                    sx={actionButtonStyles}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => onEdit(product._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(product._id)}
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
            count={Math.ceil(products.length / rowsPerPage)}
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
            Are you sure you want to delete this product? This action cannot be
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleSizeManagement}>
          <ListItemIcon>
            <SizeIcon fontSize="small" />
          </ListItemIcon>
          Size Management
        </MenuItem>
        <MenuItem onClick={handleImageGallery}>
          <ListItemIcon>
            <GalleryIcon fontSize="small" />
          </ListItemIcon>
          Image Gallery
        </MenuItem>
        <MenuItem onClick={handleProductOption}>
            <ListItemIcon>
              <GalleryIcon fontSize="small" />
            </ListItemIcon>
           Product Options
          </MenuItem>
      </Menu>

      
    </>
  );
};

export default ProductTable;