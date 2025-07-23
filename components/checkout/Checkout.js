// "use client";

// import React, { useState } from "react";

// import { List, ListItem, ListItemText } from "@mui/material";
// import Address from "@/components/dashboard/user/address/AddressList";
// import CartSummary from "@/components/cart/CartSummary";

// import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

// import Top from "@/components/topimage/Top";

// export default function CheckoutPage() {

//   return (
//     <>
//       <Top />
//       <Box
//         sx={{
//           margin: "0 auto",
//           width: "90%",
//           maxWidth: "1500px",
//         }}
//       >
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={9}>
//             <Address />
//           </Grid>

//           <Grid item md={3}>
//             <CartSummary />
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// }

"use client";

import React, { useState } from "react";

import Address from "@/components/dashboard/user/address/AddressList";
import CartSummary from "@/components/cart/CartSummary";

import { Box, Grid } from "@mui/material";

import Top from "@/components/topimage/Top";

export default function CheckoutPage() {
  const [selectedAddressCheckOut, setSelectedAddressCheckOut] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const handleAddressSelect = (address) => {
    setSelectedAddressCheckOut(address);
    setDeliveryFee(address.delivery_area_id?.delivery_fee || 0);
  };


 



  return (
    <>
      <Top />
      <Box
        sx={{
          margin: "0 auto",
          width: "90%",
          maxWidth: "1500px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <Address
              onAddressSelect={handleAddressSelect}
            
            />
          </Grid>

          <Grid item md={3}>
            <CartSummary
              selectedAddress={selectedAddressCheckOut}
              deliveryFee={deliveryFee}
              isCheckoutPage
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
