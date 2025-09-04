"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
  Fade,
  Slide,
  Zoom,
  Grow,
} from "@mui/material";
import {
  Menu as MenuIcon,
  PlayArrow,
  Restaurant,
  ShoppingCart,
  SmartToy,
  LocalShipping,
  SupportAgent,
} from "@mui/icons-material";




export default function About() {

// Create a red-themed color palette
const redTheme = {
  palette: {
    primary: {
      main: '#ee6262ff', // Strong red
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#e05d5dff', // Complementary orange
      light: '#ffa040',
      dark: '#c43e00',
    },
  },
};


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "/images/res1.jpg",
      delay: 0,
    },
    {
      name: "Maria Chen",
      role: "Head of AI Research",
      image: "/images/res2.jpg",
      delay: 100,
    },
    {
      name: "David Kim",
      role: "Product Designer",
      image: "/images/res3.jpg",
      delay: 200,
    },
    {
      name: "Sarah Williams",
      role: "Lead Developer",
      image: "/images/res6.jpg",
      delay: 300,
    },
  ];

  const features = [
    {
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      title: "AI-Powered Recommendations",
      description:
        "Our advanced AI learns your preferences to suggest dishes you'll love.",
    },
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: "Virtual Taste Testing",
      description:
        "Experience flavors through our immersive AR taste preview technology.",
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: "Seamless Ordering",
      description:
        "Order food and groceries in just a few taps with our intuitive interface.",
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: "Drone Delivery",
      description:
        "Get your orders delivered in record time with our autonomous drone fleet.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
       sx={{
          height: "100vh",
          background: `linear-gradient(to bottom, ${alpha(
            redTheme.palette.primary.main,
            0.5
          )}, ${alpha(
            redTheme.palette.secondary.main,
            0.3
          )}), url('/images/res7.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, mb: 2 }}
              >
                The Future of Food is Here
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, maxWidth: 800, mx: "auto" }}
              >
                Experience the next generation of food ordering powered by
                artificial intelligence
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  background: "white",
                  color: theme.palette.primary.main,
                  "&:hover": {
                    background: alpha("#fff", 0.9),
                  },
                }}
              >
                Explore Our Technology
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>
      {/* About Section */}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide in timeout={800} direction="right">
                <Box>
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Revolutionizing Food Tech
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: "1.1rem", mb: 3 }}
                  >
                    GenAI Food combines cutting-edge artificial intelligence
                    with an unparalleled food experience. Our platform learns
                    your tastes, predicts your cravings, and delivers
                    personalized culinary experiences right to your doorstep.
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: "1.1rem", mb: 3 }}
                  >
                    Founded in 2023, our mission is to transform how people
                    discover, order, and enjoy food through intelligent
                    technology and seamless user experiences.
                  </Typography>
                  <Button variant="contained" size="large">
                    Learn More About Our Technology
                  </Button>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide in timeout={800} direction="left">
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 6,
                    lineHeight: 0,
                  }}
                >
                  <img
                    src="/images/res7.jpg"
                    alt="AI Food Technology"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: `linear-gradient(to top, ${alpha(
                        "#000",
                        0.7
                      )}, transparent)`,
                      color: "white",
                    }}
                  >
                    <Typography variant="h6">Our AI in action</Typography>
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
    
      <Box sx={{ py: 10,}}>
        <Container maxWidth="xxl">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              See Our Platform in Action
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Watch how our AI-powered platform transforms the food ordering
              experience
            </Typography>
          </Box>

          {isVideoPlaying ? (
            // YouTube Video Embed
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 6,
                maxWidth: 1200,
                mx: "auto",
                paddingTop: "56.25%", // 16:9 aspect ratio
                height: 0,
              }}
            >
              <iframe
                width="889"
                height="500"
                src="https://www.youtube.com/embed/skR-RCpAvTc"
                title="AI-Powered Food Ordering &amp; Restaurant Ecommerce with Next.js, React &amp; Node.js  part_13"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
 style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}

              ></iframe>

            
            </Box>
          ) : (
            // Video Preview with Play Button
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 6,
                maxWidth: 900,
                mx: "auto",
                cursor: "pointer",
              }}
              onClick={handlePlayVideo}
            >
              <Box
                component="img"
                src="/images/res2.jpg"
                sx={{ width: "100%", display: "block" }}
                alt="Video preview"
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: alpha("#000", 0.3),
                  transition: "background 0.3s ease",
                  "&:hover": {
                    background: alpha("#000", 0.5),
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 80, color: "white" }} />
              </Box>
            </Box>
          )}
        </Container>
      </Box>
      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Why Choose GenAI Food?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Discover the features that make our platform revolutionary
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow
                  in
                  timeout={800}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: "primary.main", mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Team Section */}
      <Box sx={{ py: 10, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              The brilliant minds behind our innovative platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom
                  in
                  timeout={800}
                  style={{ transitionDelay: `${member.delay}ms` }}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="260"
                      image={member.image}
                      alt={member.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "white",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Ready to Experience the Future of Food?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Download our app today and let our AI create your perfect meal
            experience
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ background: "white", color: "primary.main", px: 4 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: "white", color: "white", px: 4 }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>
    
    </>
  );
}
