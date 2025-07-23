// "use client";

// import { useState, useEffect } from "react";
// import {
//   Grid,
//   Table,
//   TableBody,
//   TableHead,
//   TableRow,
//   IconButton,
//   Box,
//   CircularProgress,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import { Add, Remove, Delete } from "@mui/icons-material";
// import {
//   StyledContainer,
//   StyledTableContainer,
//   StyledTableCell,
//   StyledSummaryPaper,
//   StyledButton,
//   StyledTextField,
//   StyledTypography,
//   colorful,
// } from "./cartStyles";

// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, removeFromCart } from "@/slice/cartSlice";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const {
//     items: cartItems,
//     loading: isLoading,
//     error,
//   } = useSelector((state) => state.cart);

//   const [couponCode, setCouponCode] = useState("");
//   const [discountValue, setDiscountValue] = useState(0);
//   const [discountType, setDiscountType] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     dispatch(fetchCart());

//     const storedCoupon = sessionStorage.getItem("appliedCoupon");
//     if (storedCoupon) {
//       const { code, type, value } = JSON.parse(storedCoupon);
//       setCouponCode(code);
//       setDiscountType(type);
//       setDiscountValue(value);
//     }
//   }, [dispatch]);

//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + (item.totalPrice || 0),
//     0
//   );

//   const calculateDiscount = () => {
//     if (!discountType || !discountValue) return 0;
//     return discountType === "percentage"
//       ? (subtotal * discountValue) / 100
//       : discountValue;
//   };

//   const totalDiscount = calculateDiscount();
//   const total = subtotal - totalDiscount;

//   const handleQuantityChange = async (id, delta) => {
//     try {
//       const itemToUpdate = cartItems.find((item) => item._id === id);
//       const newQuantity = itemToUpdate.quantity + delta;
//       if (newQuantity < 1) return;

//       const response = await fetch(
//         `${process.env.API}/user/add-to-cart/${id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ quantity: newQuantity }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to update quantity");
//       await dispatch(fetchCart());
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to update quantity",
//         severity: "error",
//       });
//     }
//   };

//   const handleRemoveItem = async (id) => {
//     try {
//       await dispatch(removeFromCart(id)).unwrap();
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to remove item",
//         severity: "error",
//       });
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.API}/user/add-to-cart/clear`,
//         { method: "DELETE" }
//       );
//       if (!response.ok) throw new Error("Failed to clear cart");
//       dispatch(fetchCart());
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Failed to clear cart",
//         severity: "error",
//       });
//     }
//   };

//   const handleApplyCoupon = async () => {
//     try {
//       const response = await fetch(`${process.env.API}/coupons/apply`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: couponCode }),
//       });

//       if (!response.ok) throw new Error("Invalid or expired coupon");

//       const data = await response.json();

//       if (subtotal < data.min_purchase_amount) {
//         throw new Error(
//           `Minimum purchase of $${data.min_purchase_amount} required`
//         );
//       }

//       setDiscountType(data.discount_type);
//       setDiscountValue(data.discount);

//       sessionStorage.setItem(
//         "appliedCoupon",
//         JSON.stringify({
//           code: couponCode,
//           type: data.discount_type,
//           value: data.discount,
//         })
//       );

//       setSnackbar({
//         open: true,
//         message: `Coupon applied successfully`,
//         severity: "success",
//       });
//     } catch (err) {
//       setDiscountValue(0);
//       setDiscountType(null);
//       sessionStorage.removeItem("appliedCoupon");
//       setSnackbar({ open: true, message: err.message, severity: "error" });
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setDiscountValue(0);
//     setDiscountType(null);
//     setCouponCode("");
//     sessionStorage.removeItem("appliedCoupon");
//     setSnackbar({ open: true, message: "Coupon removed", severity: "info" });
//   };

//   const handleCheckout = async () => {
//     try {
//       const response = await fetch(`${process.env.API}/checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items: cartItems,
//           couponCode: discountValue > 0 ? couponCode : null,
//         }),
//       });
//       if (!response.ok) throw new Error("Checkout failed");
//       setSnackbar({
//         open: true,
//         message: "Redirecting to payment...",
//         severity: "success",
//       });
//     } catch (err) {
//       setSnackbar({
//         open: true,
//         message: "Checkout failed",
//         severity: "error",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <StyledContainer
//         sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
//       >
//         <CircularProgress sx={{ color: colorful.primaryGradient }} />
//       </StyledContainer>
//     );
//   }

//   if (error) {
//     return (
//       <StyledContainer>
//         <Alert severity="error" sx={{ borderRadius: "12px" }}>
//           {error}
//         </Alert>
//       </StyledContainer>
//     );
//   }

//   return (
//     <StyledContainer maxWidth="xll">
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         message={snackbar.message}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         sx={{
//           "& .MuiSnackbarContent-root": {
//             borderRadius: "12px",
//             background:
//               snackbar.severity === "error"
//                 ? colorful.errorGradient
//                 : colorful.successGradient,
//             color: colorful.lightText,
//           },
//         }}
//       />

//       <Grid container spacing={5}>
//         <Grid item xs={12} md={8}>
//           <StyledTableContainer>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>Image</StyledTableCell>
//                   <StyledTableCell>Details</StyledTableCell>
//                   <StyledTableCell>Unit Price</StyledTableCell>
//                   <StyledTableCell>Quantity</StyledTableCell>
//                   <StyledTableCell>Total</StyledTableCell>
//                   <StyledTableCell>Action</StyledTableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {cartItems.length === 0 ? (
//                   <TableRow>
//                     <StyledTableCell colSpan={6} align="center">
//                       <StyledTypography>Your cart is empty</StyledTypography>
//                     </StyledTableCell>
//                   </TableRow>
//                 ) : (
//                   cartItems.map((item) => (
//                     <TableRow key={item._id} hover>
//                       <StyledTableCell>
//                         <Box
//                           component="img"
//                           src={item.productId?.thumb_image}
//                           alt={item.productId?.name}
//                           sx={{
//                             width: 90,
//                             height: 90,
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                           }}
//                         />
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         <StyledTypography fontWeight="bold">
//                           {item.productId?.name}
//                         </StyledTypography>
//                         {item.sizeId && (
//                           <StyledTypography variant="body2">
//                             Size: {item.sizeId.name}
//                           </StyledTypography>
//                         )}
//                         {item.optionIds?.length > 0 && (
//                           <StyledTypography variant="body2">
//                             Options:{" "}
//                             {item.optionIds.map((opt) => opt.name).join(", ")}
//                           </StyledTypography>
//                         )}
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         ${item.productId?.price?.toFixed(2)}
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         <IconButton
//                           onClick={() => handleQuantityChange(item._id, -1)}
//                         >
//                           <Remove />
//                         </IconButton>
//                         <Box
//                           component="span"
//                           sx={{ mx: 1, fontWeight: "bold" }}
//                         >
//                           {item.quantity}
//                         </Box>
//                         <IconButton
//                           onClick={() => handleQuantityChange(item._id, 1)}
//                         >
//                           <Add />
//                         </IconButton>
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         ${(item.totalPrice || 0).toFixed(2)}
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         <IconButton onClick={() => handleRemoveItem(item._id)}>
//                           <Delete
//                            sx={{
//                              color:"red"
//                            }}

//                           />
//                         </IconButton>
//                       </StyledTableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </StyledTableContainer>

//           {cartItems.length > 0 && (
//             <StyledButton
//               variant="contained"
//               sx={{ mt: 3, background: colorful.errorGradient }}
//               onClick={handleClearCart}
//             >
//               Clear Cart
//             </StyledButton>
//           )}
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <StyledSummaryPaper elevation={3}>
//             <StyledTypography variant="h5" gutterBottom fontWeight="bold">
//               Cart Summary
//             </StyledTypography>

//             <Box sx={{ mb: 3 }}>
//               <Box display="flex" justifyContent="space-between" mb={1.5}>
//                 <StyledTypography>Subtotal:</StyledTypography>
//                 <StyledTypography>${subtotal.toFixed(2)}</StyledTypography>
//               </Box>

//               {totalDiscount === 0 && (
//                 <Box display="flex" justifyContent="space-between" mb={1.5}>
//                   <StyledTypography>
//                     Discount{" "}
//                     {discountType === "percentage" ? `(${discountValue}%)` : ""}
//                     :
//                   </StyledTypography>
//                   <StyledTypography sx={{ color: "#a7f3d0" }}>
//                     ${totalDiscount.toFixed(2)}
//                   </StyledTypography>
//                 </Box>
//               )}

//               {totalDiscount > 0 && (
//                 <Box display="flex" justifyContent="space-between" mb={1.5}>
//                   <StyledTypography>
//                     Discount{" "}
//                     {discountType === "percentage" ? `(${discountValue}%)` : ""}
//                     :
//                   </StyledTypography>
//                   <StyledTypography sx={{ color: "#a7f3d0" }}>
//                     -${totalDiscount.toFixed(2)}
//                   </StyledTypography>
//                 </Box>
//               )}

//               <Box display="flex" justifyContent="space-between" mb={3}>
//                 <StyledTypography variant="h6" fontWeight="bold">
//                   Total:
//                 </StyledTypography>
//                 <StyledTypography variant="h6" fontWeight="bold">
//                   ${total.toFixed(2)}
//                 </StyledTypography>
//               </Box>
//             </Box>

//             <StyledTextField
//               label="Coupon Code"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               fullWidth
//               margin="normal"
//               size="small"
//               sx={{ mb: 2 }}
//             />

//             <StyledButton
//               variant="contained"
//               fullWidth
//               onClick={handleApplyCoupon}
//               disabled={!couponCode.trim()}
//               sx={{
//                 mb: 2,
//                 color: "white",
//                 background: colorful.warningGradient,
//               }}
//             >
//               Apply Coupon
//             </StyledButton>

//             {totalDiscount > 0 && (
//               <StyledButton
//                 fullWidth
//                 sx={{
//                   mb: 2,
//                   background: colorful.errorGradient,
//                   color: "white",
//                 }}
//                 onClick={() => {
//                   setDiscountValue(0);
//                   setDiscountType(null);
//                   sessionStorage.removeItem("appliedCoupon");
//                   setCouponCode("");
//                   setSnackbar({
//                     open: true,
//                     message: "Coupon removed",
//                     severity: "info",
//                   });
//                 }}
//               >
//                 Remove Coupon
//               </StyledButton>
//             )}

//             <StyledButton
//               variant="contained"
//               fullWidth
//               size="large"
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//               sx={{ background: colorful.successGradient }}
//             >
//               Proceed to Checkout
//             </StyledButton>
//           </StyledSummaryPaper>
//         </Grid>
//       </Grid>
//     </StyledContainer>
//   );
// };

// export default Cart;

"use client";

import { useState, useEffect } from "react";
import { Grid, CircularProgress, Alert, Snackbar } from "@mui/material";
import { StyledContainer, StyledButton, colorful } from "./cartStyles";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "@/slice/cartSlice";
import CartTable from "./CartTable";
import CartSummary from "./CartSummary";

const Cart = () => {
  const dispatch = useDispatch();
  const {
    items: cartItems,
    loading: isLoading,
    error,
  } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchCart());

    const storedCoupon = sessionStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      const { code, type, value } = JSON.parse(storedCoupon);
      setCouponCode(code);
      setDiscountType(type);
      setDiscountValue(value);
    }
  }, [dispatch]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  const calculateDiscount = () => {
    if (!discountType || !discountValue) return 0;
    return discountType === "percentage"
      ? (subtotal * discountValue) / 100
      : discountValue;
  };

  const totalDiscount = calculateDiscount();
  const total = subtotal - totalDiscount;

  const handleQuantityChange = async (id, delta) => {
    try {
      const itemToUpdate = cartItems.find((item) => item._id === id);
      const newQuantity = itemToUpdate.quantity + delta;
      if (newQuantity < 1) return;

      const response = await fetch(
        `${process.env.API}/user/add-to-cart/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to update quantity");
      await dispatch(fetchCart());
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update quantity",
        severity: "error",
      });
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await dispatch(removeFromCart(id)).unwrap();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to remove item",
        severity: "error",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/user/add-to-cart/clear`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to clear cart");
      dispatch(fetchCart());
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to clear cart",
        severity: "error",
      });
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`${process.env.API}/coupons/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      if (!response.ok) throw new Error("Invalid or expired coupon");

      const data = await response.json();

      if (subtotal < data.min_purchase_amount) {
        throw new Error(
          `Minimum purchase of $${data.min_purchase_amount} required`
        );
      }

      setDiscountType(data.discount_type);
      setDiscountValue(data.discount);

      sessionStorage.setItem(
        "appliedCoupon",
        JSON.stringify({
          code: couponCode,
          type: data.discount_type,
          value: data.discount,
        })
      );

      setSnackbar({
        open: true,
        message: `Coupon applied successfully`,
        severity: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 second delay
    } catch (err) {
      setDiscountValue(0);
      setDiscountType(null);
      sessionStorage.removeItem("appliedCoupon");
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountValue(0);
    setDiscountType(null);
    setCouponCode("");
    sessionStorage.removeItem("appliedCoupon");
    setSnackbar({ open: true, message: "Coupon removed", severity: "info" });
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 second delay
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${process.env.API}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          couponCode: discountValue > 0 ? couponCode : null,
        }),
      });
      if (!response.ok) throw new Error("Checkout failed");
      setSnackbar({
        open: true,
        message: "Redirecting to payment...",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Checkout failed",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <StyledContainer
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress sx={{ color: colorful.primaryGradient }} />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xll">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            borderRadius: "12px",
            background:
              snackbar.severity === "error"
                ? colorful.errorGradient
                : colorful.successGradient,
            color: colorful.lightText,
          },
        }}
      />

      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          <CartTable
            cartItems={cartItems}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
          />

          {cartItems.length > 0 && (
            <StyledButton
              variant="contained"
              sx={{ mt: 3, background: colorful.errorGradient }}
              onClick={handleClearCart}
            >
              Clear Cart
            </StyledButton>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <CartSummary
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            discountType={discountType}
            discountValue={discountValue}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            handleApplyCoupon={handleApplyCoupon}
            handleRemoveCoupon={handleRemoveCoupon}
            handleCheckout={handleCheckout}
            cartItems={cartItems}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Cart;
