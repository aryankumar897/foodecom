import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import Tab from "./Tab";
import Top from "@/components/topimage/Top";
import Related from "@/components/related/Product";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ProductGallery from "./ImageGallery";
import { Chip } from "@mui/material";

export default function ProductDetails() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const params = useParams();
  const slug = params?.id;

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.API}/product-single-details/${slug}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        // Set the first size as selected if sizes exist
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;

    let total = product.offer_price || product.price;

    if (selectedSize) {
      const selectedSizeObj = product.sizes.find(
        (size) => size._id === selectedSize
      );
      if (selectedSizeObj && typeof selectedSizeObj.price === "number") {
        total += selectedSizeObj.price;
      }
    }

    const optionsTotal = product.options.reduce((sum, option) => {
      if (selectedOptions[option._id] && typeof option.price === "number") {
        return sum + option.price;
      }
      return sum;
    }, 0);

    return (total + optionsTotal) * quantity;
  };

  const totalPrice = calculateTotalPrice();

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  };

  const handleAddToCart = async () => {
    try {
      const selectedOptionIds = Object.keys(selectedOptions).filter(
        (optionId) => selectedOptions[optionId]
      );

      const payload = {
        productId: product._id,
        sizeId: selectedSize,
        optionIds: selectedOptionIds,
        quantity,
      };

      const res = await fetch(`${process.env.API}/user/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      alert("✅ Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography>Loading product details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  return (
    <>
      <Top />
      <Container sx={{ mt: 10, mb: 8 }}>
        <Grid container spacing={6}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: isSmallScreen ? "300px" : "600px",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <ProductGallery
                thumbImage={product.thumb_image}
                gallery={product.gallery}
                onImageChange={(img) => console.log("Image changed to:", img)} // optional
              />
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              component="h1"
              fontWeight="bold"
            >
              {product.name}
            </Typography>

            {product.category_id?.name && (
              <Chip
                label={product.category_id.name}
                variant="outlined"
                size="small"
                sx={{
                  mt: 1,
                  borderColor: "red",
                  p: "3px",
                  color: "red",
                  "& .MuiChip-label": {
                    fontSize: "1rem", // or e.g., '16px'
                    fontWeight: "bold",
                  },
                }}
              />
            )}

            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                Description:
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  fontWeight: 500, // Semi-bold for better emphasis
                  lineHeight: 1.6,
                }}
              >
                {product.short_description}
              </Typography>
            </Box>

            <Box sx={{ my: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {product.offer_price ? (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    <Typography variant="h5" color="error">
                      {formatPrice(product.offer_price)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h5" color="text.primary">
                    {formatPrice(product.price)}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Sizes */}

            {product.sizes?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup
                  aria-label="size"
                  name="size"
                  value={selectedSize || ""}
                  onChange={handleSizeChange}
                >
                  <Grid container spacing={1}>
                    {product.sizes.map((size) => (
                      <Grid item key={size._id}>
                        <FormControlLabel
                          value={size._id}
                          control={
                            <Radio
                              size={isSmallScreen ? "small" : "medium"}
                              sx={{
                                color: theme.palette.error.main,
                                "&.Mui-checked": {
                                  color: theme.palette.error.main,
                                },
                              }}
                            />
                          }
                          label={`${size.name} (${formatPrice(size.price)})`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </Box>
            )}

            {/* Options */}
            {product.options?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <FormLabel component="legend">Options</FormLabel>
                <Grid container spacing={1}>
                  {product.options.map((option) => (
                    <Grid item key={option._id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size={isSmallScreen ? "small" : "medium"}
                            sx={{
                              color: theme.palette.error.main,
                              "&.Mui-checked": {
                                color: theme.palette.error.main,
                              },
                            }}
                            checked={selectedOptions[option._id] || false}
                            onChange={() => handleOptionChange(option._id)}
                          />
                        }
                        label={`${option.name} (${formatPrice(option.price)})`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Quantity */}
            <Box sx={{ mt: 3 }}>
              <FormLabel component="legend">Quantity</FormLabel>
              <Box display="flex" alignItems="center" mt={1}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{ color: theme.palette.error.main }}
                >
                  <RemoveIcon fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 2 }}>
                  {quantity}
                </Typography>
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  size={isSmallScreen ? "small" : "medium"}
                  sx={{ color: theme.palette.error.main }}
                >
                  <AddIcon fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
              </Box>
            </Box>

            {/* Total Price */}
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              sx={{
                mt: 3,
                fontWeight: "bold",
                color: theme.palette.error.main,
              }}
            >
              Total: {formatPrice(totalPrice)}
            </Typography>

            {/* Add to Cart Button */}
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.5,
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                }}
              >
                Add to Wishlist
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  backgroundColor: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Product Description Tabs */}
        <Box sx={{ mt: 4 }}>
          <Tab product={product} />
        </Box>

        {/* Related Products */}
        <Box sx={{ mt: 4 }}>
          <Related
            currentProductId={product._id}
            categoryId={product.category_id?._id}
          />
        </Box>
      </Container>
    </>
  );
}
