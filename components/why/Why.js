"use client";
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// CategoryCard component
const CategoryCard = ({ title, subtitle, Icon }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: "red",
        color: "white",

        m: 1,
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "red",
          color: "white",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          {Icon && <Icon fontSize="large" />}
        </Box>
        <Typography variant="h6" component="div" align="center">
          {title}
        </Typography>
        <Typography variant="body2" align="center" m={2}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const dummyData = [
  {
    title: "Explore Our Menu",
    subtitle: "Discover delicious dishes crafted with fresh ingredients",
    icon: CategoryIcon,
  },
  {
    title: "Find a Location",
    subtitle: "Locate our nearest restaurant or order for delivery",
    icon: LocalDiningIcon,
  },
  {
    title: "Contact Us",
    subtitle: "Have questions? Reach out to our friendly team",
    icon: DirectionsCarIcon,
  },
];

export default function Home() {
  return (
    <Container
      sx={{
        mt: "32px",
        mb: "56px",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 900,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        why choose us
      </Typography>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 900,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        why choose us
      </Typography>
      <Typography
        variant="body2"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 600,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",

          zIndex: 11111,
        }}
      >
        See to all of the props and classes available to the
      </Typography>
      <Grid container spacing={3}>
        {dummyData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CategoryCard
              title={item.title}
              subtitle={item.subtitle}
              Icon={item.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}






































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
//   const [discount, setDiscount] = useState(0);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

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

//       await dispatch(fetchCart()); // Refresh after quantity update
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
//       if (!response.ok) throw new Error("Invalid coupon code");
//       const data = await response.json();
//       setDiscount(data.discount);
//     } catch (err) {
//       setSnackbar({ open: true, message: err.message, severity: "error" });
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       const response = await fetch(`${process.env.API}/checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           items: cartItems,
//           couponCode: discount > 0 ? couponCode : null,
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

//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + (item.totalPrice || 0),
//     0
//   );
//   const totalDiscount = subtotal * (discount / 100);
//   const total = subtotal - totalDiscount;

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
//                     <TableRow
//                       key={item._id}
//                       hover
//                       sx={{
//                         "&:hover": { background: "rgba(255,255,255,0.5)" },
//                       }}
//                     >
//                       <StyledTableCell>
//                         <Box
//                           component="img"
//                           src={item.productId?.thumb_image}
//                           alt={item.productId?.name}
//                           sx={{
//                             width: 60,
//                             height: 60,
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                           }}
//                         />
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         <StyledTypography fontWeight="bold">
//                           {item.productId?.name}
//                         </StyledTypography>
//                         {item.sizeId && (
//                           <StyledTypography
//                             variant="body2"
//                             sx={{ color: colorful.textSecondary }}
//                           >
//                             Size: {item.sizeId.name}
//                           </StyledTypography>
//                         )}
//                         {item.optionIds?.length > 0 && (
//                           <StyledTypography
//                             variant="body2"
//                             sx={{ color: colorful.textSecondary }}
//                           >
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
//                           disabled={item.quantity === 1}
//                           sx={{
//                             color: colorful.textPrimary,
//                             "&:hover": { background: "rgba(0,0,0,0.05)" },
//                           }}
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
//                           sx={{
//                             color: colorful.textPrimary,
//                             "&:hover": { background: "rgba(0,0,0,0.05)" },
//                           }}
//                         >
//                           <Add />
//                         </IconButton>
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         ${(item.totalPrice || 0).toFixed(2)}
//                       </StyledTableCell>
//                       <StyledTableCell>
//                         <IconButton
//                           onClick={() => handleRemoveItem(item._id)}
//                           sx={{
//                             color: colorful.errorGradient,
//                             "&:hover": { background: "rgba(255,0,0,0.1)" },
//                           }}
//                         >
//                           <Delete />
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
//               sx={{
//                 mt: 3,
//                 background: colorful.errorGradient,
//                 "&:hover": { background: colorful.errorGradient, opacity: 0.9 },
//               }}
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

//               {discount > 0 && (
//                 <Box display="flex" justifyContent="space-between" mb={1.5}>
//                   <StyledTypography>Discount ({discount}%):</StyledTypography>
//                   <StyledTypography sx={{ color: "#a7f3d0" }}>
//                     -${totalDiscount.toFixed(2)}
//                   </StyledTypography>
//                 </Box>
//               )}

//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 mb={3}
//                 sx={{ pt: 2, borderTop: "1px dashed rgba(255,255,255,0.3)" }}
//               >
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

//             <StyledButton
//               variant="contained"
//               fullWidth
//               size="large"
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//               sx={{
//                 background: colorful.successGradient,
//                 "&:hover": {
//                   background: colorful.successGradient,
//                   opacity: 0.9,
//                 },
//                 "&:disabled": { background: "rgba(255,255,255,0.2)" },
//               }}
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
