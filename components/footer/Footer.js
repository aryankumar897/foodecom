"use client"




import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  ArrowUpward,
  Send,
  RestaurantMenu,
  LocalShipping,
  SupportAgent,
  Payment
} from '@mui/icons-material';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const theme = useTheme();

  // Red color palette
  const redTheme = {
    primary: '#e53935', // Vibrant red
    secondary: '#ff5252', // Lighter red
    dark: '#b71c1c', // Dark red
    accent: '#ff8a65', // Complementary orange
    background: '#180811ff' // Dark background
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const footerLinks = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog', 'Contact Us']
    },
    {
      title: 'Services',
      links: ['Food Delivery', 'Grocery Delivery', 'Meal Plans', 'Catering', 'Business Solutions']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety Tips', 'FAQs', 'Terms of Service', 'Privacy Policy']
    }
  ];

  const features = [
    { icon: <RestaurantMenu />, text: '1000+ Restaurants' },
    { icon: <LocalShipping />, text: 'Fast Delivery' },
    { icon: <SupportAgent />, text: '24/7 Support' },
    { icon: <Payment />, text: 'Secure Payment' }
  ];

  const socialLinks = [
    { icon: <Facebook />, url: '#', color: '#1877F2' },
    { icon: <Twitter />, url: '#', color: '#1DA1F2' },
    { icon: <Instagram />, url: '#', color: '#E4405F' },
    { icon: <LinkedIn />, url: '#', color: '#0A66C2' },
    { icon: <YouTube />, url: '#', color: '#FF0000' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: redTheme.background,
        color: 'white',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${redTheme.primary}, ${redTheme.accent})`,
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(${alpha(redTheme.primary, 0.2)} 0%, transparent 70%)`,
          animation: 'pulse 8s infinite alternate',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.3 },
            '100%': { transform: 'scale(1.2)', opacity: 0.5 }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(${alpha(redTheme.accent, 0.2)} 0%, transparent 70%)`,
          animation: 'pulse2 6s infinite alternate',
          '@keyframes pulse2': {
            '0%': { transform: 'scale(1) translateY(0)', opacity: 0.2 },
            '100%': { transform: 'scale(1.1) translateY(-20px)', opacity: 0.4 }
          }
        }}
      />

      {/* Scroll to top button */}
      <Zoom in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            bgcolor: redTheme.primary,
            color: 'white',
            '&:hover': {
              bgcolor: redTheme.dark,
              transform: 'translateY(-5px) scale(1.1)'
            },
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 20px ${alpha(redTheme.primary, 0.5)}`,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }}
        >
          <ArrowUpward />
        </IconButton>
      </Zoom>

      <Container maxWidth="lg">
        {/* Feature chips */}
        <Fade in timeout={1000}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
            {features.map((feature, index) => (
              <Chip
                key={index}
                icon={feature.icon}
                label={feature.text}
                sx={{
                  bgcolor: alpha(redTheme.primary, 0.1),
                  color: 'white',
                  border: `1px solid ${alpha(redTheme.primary, 0.3)}`,
                  py: 2,
                  px: 1,
                  '&:hover': {
                    bgcolor: alpha(redTheme.primary, 0.2),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 8px ${alpha(redTheme.primary, 0.3)}`
                  },
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={1000}>
              <Box>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${redTheme.primary}, ${redTheme.accent})`,
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <Box component="span" sx={{ mr: 1 }}>Gen</Box>
                  AI Food
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, maxWidth: 300 }}>
                  Revolutionizing the food industry with artificial intelligence and machine learning. 
                  Delivering delicious experiences right to your doorstep.
                </Typography>
                
                {/* Social links */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {socialLinks.map((social, index) => (
                    <Slide in timeout={800} direction="up" key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                      <IconButton
                        sx={{
                          color: 'white',
                          bgcolor: alpha(social.color, 0.2),
                          '&:hover': {
                            color: 'white',
                            bgcolor: social.color,
                            transform: 'translateY(-5px) rotate(5deg)',
                            boxShadow: `0 6px 12px ${alpha(social.color, 0.4)}`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Slide>
                  ))}
                </Box>
                
                {/* Contact info */}
                <Box sx={{ opacity: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(5px)', color: redTheme.primary } }}>
                    <Email sx={{ fontSize: 20, mr: 1, color: redTheme.primary }} />
                    <Typography variant="body2">hello@genaifood.com</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(5px)', color: redTheme.primary } }}>
                    <Phone sx={{ fontSize: 20, mr: 1, color: redTheme.primary }} />
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateX(5px)', color: redTheme.primary } }}>
                    <LocationOn sx={{ fontSize: 20, mr: 1, color: redTheme.primary }} />
                    <Typography variant="body2">123 AI Street, Tech City</Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <Grid item xs={12} sm={6} md={2} key={sectionIndex}>
              <Fade in timeout={1000} style={{ transitionDelay: `${sectionIndex * 200}ms` }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '30px',
                        height: '3px',
                        background: `linear-gradient(90deg, ${redTheme.primary}, ${redTheme.accent})`,
                        borderRadius: 2
                      }
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href="#"
                        variant="body2"
                        sx={{
                          display: 'block',
                          mb: 1.5,
                          color: 'grey.400',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          pl: 2,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            bgcolor: redTheme.primary,
                            opacity: 0,
                            transition: 'all 0.3s ease'
                          },
                          '&:hover': {
                            color: redTheme.primary,
                            transform: 'translateX(8px)',
                            '&::before': {
                              opacity: 1
                            }
                          }
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>
          ))}

          {/* Newsletter subscription */}
          <Grid item xs={12} md={3}>
            <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '30px',
                      height: '3px',
                      background: `linear-gradient(90deg, ${redTheme.primary}, ${redTheme.accent})`,
                      borderRadius: 2
                    }
                  }}
                >
                  Stay Updated
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  Subscribe to our newsletter for the latest updates and offers
                </Typography>
                <Box component="form" onSubmit={handleSubscribe}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: alpha(redTheme.primary, 0.5),
                          transition: 'all 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: redTheme.primary,
                          boxShadow: `0 0 0 2px ${alpha(redTheme.primary, 0.2)}`
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: redTheme.primary,
                          boxShadow: `0 0 0 2px ${alpha(redTheme.primary, 0.2)}`
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    endIcon={<Send />}
                    sx={{
                      background: `linear-gradient(45deg, ${redTheme.primary}, ${redTheme.accent})`,
                      fontWeight: 600,
                      py: 1,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${redTheme.dark}, ${redTheme.primary})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 12px ${alpha(redTheme.primary, 0.4)}`
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: alpha(redTheme.primary, 0.3) }} />

        {/* Copyright section */}
        <Fade in timeout={1000} style={{ transitionDelay: '800ms' }}>
          <Box sx={{ textAlign: 'center', opacity: 0.7 }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} GenAI Food. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Made with <Box component="span" sx={{ color: redTheme.primary }}>❤️</Box> by the GenAI Team
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Footer;