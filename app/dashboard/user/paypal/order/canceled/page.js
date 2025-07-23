"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const PaymentFailed = () => {
//   const [countdown, setCountdown] = useState(10);
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev === 1) {
//           clearInterval(timer);
//           router.push("/retry-payment"); // change this route as needed
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="row justify-content-center"
      >
        <div className="col-12 col-md-8 text-center">
          <motion.div
            className="p-4 rounded shadow"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <motion.div
              animate={{ x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
              style={{ fontSize: "4rem", color: "red", marginBottom: "20px" }}
            >
              ✘
            </motion.div>

            <h1 className="display-5 mb-3">Payment Failed</h1>
            <p className="lead text-danger">Oops! Something went wrong with your transaction.</p>
          
            {/* <p className="text-muted mb-4">Redirecting in <strong>{countdown}</strong> seconds...</p> */}



            <Link href="/" className="btn btn-outline-danger">
              Try Again Now
            </Link>

            <div className="mt-4 text-muted fst-italic">
              Don’t worry. Failure is simply the opportunity to begin again. 💡
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
