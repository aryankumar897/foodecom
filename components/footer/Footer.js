"use client";

import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Facebook,
  Twitter,
  Instagram,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Footer Component
const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle newsletter logic here
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const headingStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: "1.25rem", // 20px
    marginBottom: "8px",
  };

  const textStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: "0.95rem", // ~15px
    marginBottom: "6px",
  };

  return (
    <footer
      style={{
        backgroundColor: "red",
        padding: "50px 0",
        textAlign: "center",
        color: "white",
        marginTop: "26px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "2rem", // 32px
            }}
          >
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
            }}
          >
            Stay updated with our latest news and updates.
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {/* Brand Info */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              custom={1}
            >
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Avatar src="/images/ecom.jpg" alt="Logo" sx={{ mr: 1 }} />
                <Typography sx={headingStyle}>PlusList</Typography>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography sx={textStyle}>123 Main St, City, Country</Typography>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Phone sx={{ mr: 1 }} />
                <Typography sx={textStyle}>+1 234 567 890</Typography>
              </Box>
              <Box>
                <IconButton color="inherit" sx={{ color: "white" }}>
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" sx={{ color: "white" }}>
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" sx={{ color: "white" }}>
                  <Instagram />
                </IconButton>
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              custom={2}
            >
              <Typography sx={headingStyle}>Quick Links</Typography>
              {["Home", "Shop", "Contact", "FAQs"].map((text, i) => (
                <Typography key={i} sx={textStyle}>
                  {text}
                </Typography>
              ))}
            </motion.div>
          </Grid>

          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              custom={3}
            >
              <Typography sx={headingStyle}>Company</Typography>
              {["About Us", "Careers", "Terms", "Privacy"].map((text, i) => (
                <Typography key={i} sx={textStyle}>
                  {text}
                </Typography>
              ))}
            </motion.div>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              custom={4}
            >
              <Typography sx={headingStyle}>Newsletter</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  label="Your Email"
                  type="email"
                  required
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    mb: 2,
                    input: {
                      color: "red",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    color: "red",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "darkred",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </form>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
