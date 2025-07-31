// "use client";

// // pages/payment.js
// import Image from "next/image";
// import { useState } from "react";
// import {
//   Divider,
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
// } from "@mui/material";
// import CartSummary from "@/components/cart/CartSummary";
// const Payment = () => {
//   return (
//     <Container style={{ marginTop: "24px" }}>
//       <Grid container spacing={3}>
//         {/* Left Side - Payment Options */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h6" className="text-dark">
//             Choose Payment Gateway
//           </Typography>

//           <Button
//             sx={{
//               boxShadow: 1,
//               margin: "20px",
//               "&:hover": {
//                 backgroundColor: "#ff531a",
//                 border: "#ff531a",
//               },
//             }}
//             /* onClick={handlePaypal} */
//           >
//             <Image
//               src="/images/paypal.jpg"
//               alt="PayPal"
//               width={110}
//               height={100}
//               objectFit="contain"
//             />
//           </Button>
//           <Button
//             sx={{
//               boxShadow: 1,
//               margin: "20px",
//               "&:hover": {
//                 backgroundColor: "#ff531a",
//                 border: "#ff531a",
//               },
//             }}

//             /* onClick={handleStripe} */
//           >
//             <Image
//               src="/images/stripe.jpg"
//               alt="Stripe"
//               width={110}
//               height={100}
//               objectFit="contain"
//             />
//           </Button>
//           <Button
//             sx={{
//               boxShadow: 1,

//               "&:hover": {
//                 backgroundColor: "#ff531a",
//                 border: "#ff531a",
//               },
//             }}
//             /* onClick={handleRazorpay} */
//           >
//             <Image
//               src="/images/rozorpay.jpg"
//               alt="Razorpay"
//               width={110}
//               height={100}
//               objectFit="contain"
//             />
//           </Button>
//         </Grid>

//         {/* Right Side - Order Summary */}
//         <Grid item xs={12} md={6}>
//           <CartSummary isPaymentPage />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default Payment;

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Divider,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import CartSummary from "@/components/cart/CartSummary";
import { useSession } from "next-auth/react";

 


const Payment = () => {

  
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data } = useSession();
  // 1. Load checkout data from sessionStorage
  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const savedData = JSON.parse(sessionStorage.getItem("checkoutData"));
        if (
          !savedData ||
          !savedData.cartItems ||
          savedData.cartItems.length === 0
        ) {
          throw new Error("No checkout data found");
        }
        setCheckoutData(savedData);
      } catch (err) {
        setError(err.message);
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    const loadHandler = () => {
      console.log("Razorpay script loaded");
    };

    script.addEventListener("load", loadHandler);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", loadHandler);
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpay = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/user/payment/razorpaypayment/razorpay/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutData),
        }
      );
      const serverdata = await response.json();
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data && data.amount * 100,
        currency: "INR",
        name: "BrainByte",
        description: "Test Payment",
        order_id: serverdata && serverdata.id,
        handler: function (response) {
          verifyPayment(response.razorpay_payment_id);
          setLoading(false);
        },
        prefill: {
          name: data && data.name,
          email: data && data.email,
        },
        notes: {
          address: "Your Address",
        },
        theme: {
          color: "#f02424ff",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log("Error initiating payment:", error);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/razorpaypayment/razorpayverify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
        }
      );
      const data = await response.json();
      if (data?.err) {
        router.push("/cancel");
      } else {
        sessionStorage.removeItem("checkoutData");
        sessionStorage.removeItem("appliedCoupon");
        router.push("/success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 2. Payment handlers
  const handleStripe = async () => {





 

    // if (!checkoutData?.address) {
    //   setError("Please select a delivery address");
    //   return;
    // }

    // try {
    //   setLoading(true);

    //   // Example API call - replace with your actual payment integration
    //   const response = await fetch(
    //     `${process.env.API}/user/payment/stripepayment/stripe`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(checkoutData),
    //     }
    //   );

    //   if (!response.ok) throw new Error("Payment initialization failed");

    //   const data = await response.json();
    //   if (!response.ok) {
    //     toast.error(data.err);
    //   } else {
    //     window.location.href = data.url;
    //   }
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }



  };

  const handlePaypal = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/paypalpayment/paypal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("paypal payment failed");
      } else {
        router.push(data?.url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => router.push("/cart")}
        >
          Back to Cart
        </Button>
      </Container>
    );
  }

  return (
    <>
      {JSON.stringify({ checkoutData }, null, 4)}
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Left Side - Payment Options */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Choose Payment Method
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {/* PayPal */}
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "100px",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => handlePaypal()}
                  disabled={!checkoutData?.address}
                >
                  <Image
                    src="/images/paypal.jpg"
                    alt="PayPal"
                    width={110}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </Button>
              </Grid>

              {/* Stripe */}
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "100px",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => handleStripe()}
                  disabled={!checkoutData?.address}
                >
                  <Image
                    src="/images/stripe.jpg"
                    alt="Stripe"
                    width={110}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </Button>
              </Grid>

              {/* Razorpay */}
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: "100px",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onClick={() => handleRazorpay()}
                  disabled={!checkoutData?.address}
                >
                  <Image
                    src="/images/rozorpay.jpg"
                    alt="Razorpay"
                    width={110}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </Button>
              </Grid>
            </Grid>

            {/* Payment Terms */}
            <Box
              sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Your payment is secure with 256-bit SSL encryption. We don't
                store your payment details.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Order Summary */}
          <Grid item xs={12} md={6}>
            <CartSummary isPaymentPage />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Payment;
