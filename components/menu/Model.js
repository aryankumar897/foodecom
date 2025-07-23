import React, { useState, useEffect } from "react";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Rating from "@mui/material/Rating";
import CloseIcon from "@mui/icons-material/Close";
import {
  ModelContainer,
  CloseButton,
  ProductImage,
  CategoryTag,
  SizeFormControl,
  QuantityBox,
  SecondaryButton,
  PrimaryButton,
  ScrollableContent,
  FixedFooter,
} from "./ModelStyles";

import { useDispatch } from "react-redux";
import { addToCart } from "@/slice/cartSlice";

const Model = ({ product, onClose }) => {
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const productName = product?.name || product?.title || "Product Title";
  const productImage =
    product?.thumb_image || product?.imageUrl || "/images/res1.jpg";
  const basePrice = Number(product?.product_price) || 0;
  const offerPrice = Number(product?.product_offer_price) || null;
  const ratingValue = product?.rating || 4;
  const category =
    product?.categories || product?.category_id?.name || "Uncategorized";
  const productId = product?.productId || product?._id;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.API}/product-details?product_id=${productId}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.err || "Failed to fetch product details");
        }

        const { sizes: sizesData, options: optionsData } =
          await response.json();
        setSizes(sizesData);
        setOptions(optionsData);

        if (sizesData.length > 0) {
          setSelectedSize(sizesData[0]._id);
        }

        const initialOptions = {};
        optionsData.forEach((option) => {
          initialOptions[option._id] = false;
        });
        setSelectedOptions(initialOptions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

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
    let total = basePrice;

    if (selectedSize) {
      const selectedSizeObj = sizes.find((size) => size._id === selectedSize);
      if (selectedSizeObj && typeof selectedSizeObj.price === "number") {
        total += selectedSizeObj.price;
      }
    }

    const optionsTotal = options.reduce((sum, option) => {
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

  // const handleAddToCart = async () => {
  //   try {
  //     const selectedOptionIds = Object.keys(selectedOptions).filter(
  //       (optionId) => selectedOptions[optionId]
  //     );

  //     const payload = {
  //       productId,
  //       sizeId: selectedSize,
  //       optionIds: selectedOptionIds,
  //       quantity,
  //     };

  //     const res = await fetch(`${process.env.API}/user/add-to-cart`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.error || "Failed to add to cart");
  //     }

  //     alert("✅ Product added to cart successfully!");
  //   } catch (err) {
  //     console.error("Error adding to cart:", err);
  //     alert("❌ Failed to add to cart");
  //   }
  // };

  const handleAddToCart = async () => {
    try {
      const selectedOptionIds = Object.keys(selectedOptions).filter(
        (id) => selectedOptions[id]
      );

      const payload = {
        productId,
        sizeId: selectedSize,
        optionIds: selectedOptionIds,
        quantity,
      };

      await dispatch(addToCart(payload));
      alert("✅ Product added to cart successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <ModelContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      </ModelContainer>
    );
  }

  if (error) {
    return (
      <ModelContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <Typography color="error" sx={{ p: 3 }}>
          Error: {error}
        </Typography>
      </ModelContainer>
    );
  }

  return (
    <ModelContainer>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>

      <ScrollableContent>
        <ProductImage src={productImage} alt={productName} />
        <CategoryTag label={category} />

        <Box sx={{ mt: 2 }}>
          <Typography variant={isSmallScreen ? "h6" : "h5"} component="div">
            {productName}
          </Typography>

          <Rating
            name="product-rating"
            value={ratingValue}
            readOnly
            size={isSmallScreen ? "small" : "medium"}
            sx={{ my: 1 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {offerPrice ? (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {formatPrice(basePrice)}
                </Typography>
                <Typography variant="h6" color="error">
                  {formatPrice(offerPrice)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="text.primary">
                {formatPrice(basePrice)}
              </Typography>
            )}
          </Box>
        </Box>

        {sizes.length > 0 && (
          <SizeFormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">Size</FormLabel>
            <RadioGroup
              aria-label="size"
              name="size"
              value={selectedSize || ""}
              onChange={handleSizeChange}
            >
              {sizes.map((size) => (
                <FormControlLabel
                  key={size._id}
                  value={size._id}
                  control={
                    <Radio
                      size={isSmallScreen ? "small" : "medium"}
                      sx={{
                        color: theme.palette.error.main,
                        "&.Mui-checked": { color: theme.palette.error.main },
                      }}
                    />
                  }
                  label={`${size.name} (${formatPrice(size.price)})`}
                />
              ))}
            </RadioGroup>
          </SizeFormControl>
        )}

        {options.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <FormLabel component="legend">Options</FormLabel>
            {options.map((option) => (
              <FormControlLabel
                key={option._id}
                control={
                  <Checkbox
                    size={isSmallScreen ? "small" : "medium"}
                    sx={{
                      color: theme.palette.error.main,
                      "&.Mui-checked": { color: theme.palette.error.main },
                    }}
                    checked={selectedOptions[option._id] || false}
                    onChange={() => handleOptionChange(option._id)}
                    name={option._id}
                  />
                }
                label={`${option.name} (${formatPrice(option.price)})`}
              />
            ))}
          </Box>
        )}

        <QuantityBox sx={{ mt: 3 }}>
          <Typography variant="body1">Quantity</Typography>
          <Box display="flex" alignItems="center">
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
        </QuantityBox>

        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{
            mt: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: theme.palette.error.main,
          }}
        >
          Total: {formatPrice(totalPrice)}
        </Typography>
      </ScrollableContent>

      <FixedFooter>
        <Box sx={{ display: "flex", gap: 2 }}>
          <SecondaryButton variant="outlined" fullWidth>
            Add to Wishlist
          </SecondaryButton>
          <PrimaryButton
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
          >
            Add to Cart
          </PrimaryButton>
        </Box>
      </FixedFooter>
    </ModelContainer>
  );
};

export default Model;
