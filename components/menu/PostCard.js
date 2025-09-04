// PostCard.js
"use client";
import React, { useState } from "react";
import {
  IconButton,
  Box,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  useMediaQuery,
  useTheme,
  Rating,
} from "@mui/material";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CompareIcon from "@mui/icons-material/Compare";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Model from "./Model";
import {
  StyledCard,
  CategoryChip,
  PriceContainer,
  RatingBox,
} from "./PostCardStyles";

import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const PostCard = ({ post }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data } = useSession();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Extract product data from post prop
  const {
    title = "Product Title",
    categories = "Uncategorized",
    rating = 4.5,
    imageUrl = "/default-product.jpg",
    price = "$0.00",
    product_slug,
  } = post;

  const handlewishlist = async () => {
    if (!data) {
      toast.error("Please login first");
      //return
    }

    try {
      const productId = post.productId;
      const response = await fetch(`${process.env.API}/user/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data?.err) {
        toast.error(data?.err);
      } else {
        toast.success("Product added successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StyledCard>
        <Box sx={{ position: "relative" }}>
          {/* Category Badge */}
          <CategoryChip label={categories} size="small" />

          {/* Product Image */}
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              height: isMobile ? 180 : 220,
              width: "100%",
              objectFit: "cover",
            }}
          />

          {/* Price - Bottom Right */}
          <PriceContainer>
            <Typography variant="body2">{price} </Typography>
          </PriceContainer>

          {/* Wishlist Button */}
          <IconButton
            onClick={handlewishlist}
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              right: theme.spacing(1),
              color: theme.palette.common.white,
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
            }}
            size={isMobile ? "small" : "medium"}
          >
            <FavoriteBorderIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>

        {/* Product Content */}
        <CardContent
          sx={{
            p: 2,
            backgroundColor: "background.paper",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Rating - Above Title */}
          <RatingBox>
            <Rating
              name="product-rating"
              value={rating}
              precision={0.5}
              size={isMobile ? "small" : "medium"}
              readOnly
              sx={{ color: theme.palette.warning.main }}
            />
            <Typography variant="body2" color="text.secondary">
              ({rating})
            </Typography>
          </RatingBox>

          {/* Product Title */}
          <Typography
            gutterBottom
            variant={isMobile ? "body1" : "h6"}
            component="div"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              minHeight: isMobile ? "40px" : "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {title}
          </Typography>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-around" sx={{ pt: 1 }}>
            <IconButton
              onClick={handleOpen}
              aria-label="add to cart"
              sx={{ color: theme.palette.error.main }}
              size={isMobile ? "small" : "medium"}
            >
              <ShoppingCartIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>

            <IconButton
              aria-label="compare"
              sx={{ color: theme.palette.error.main }}
              size={isMobile ? "small" : "medium"}
              onClick={handleOpen}
            >
              <CompareIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>

            <Link href={`/product/${product_slug}`} passHref>
              <IconButton
                aria-label="quick view"
                sx={{ color: theme.palette.error.main }}
                size={isMobile ? "small" : "medium"}
                component="a" // This makes the IconButton render as an <a> tag
                rel="noopener noreferrer"
              >
                <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Link>
          </Box>
        </CardContent>

        {/* Product Modal */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(252, 247, 247, 0.8)",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "45%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              outline: "none",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Model
                isMobile={isMobile}
                product={post}
                onClose={() => setOpen(false)} // This is crucial
              />
            </Box>
          </Box>
        </Modal>
      </StyledCard>
    </>
  );
};

export default PostCard;
