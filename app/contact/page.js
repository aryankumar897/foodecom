"use client"
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  Alert,
  IconButton,
  Fab
} from '@mui/material';
import {
  Send,
  LocationOn,
  Email,
  Phone,
  Schedule,
  SupportAgent,
  Close,
  Chat,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const formRef = useRef();

  // Enhanced color palette
  const colors = {
    primary: '#ff3b30', // Vibrant red
    secondary: '#ff6b6b', // Softer red
    dark: '#cc0000', // Darker red
    accent: '#ff9f43', // Complementary orange
    backgroundGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)'
  };

  const contactMethods = [
    {
      icon: <Email sx={{ fontSize: 30 }} />,
      title: 'Email Us',
      details: 'hello@genaifood.com',
      description: 'Send us an email anytime',
      action: 'mailto:hello@genaifood.com'
    },
    {
      icon: <Phone sx={{ fontSize: 30 }} />,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
      action: 'tel:+15551234567'
    },
    {
      icon: <LocationOn sx={{ fontSize: 30 }} />,
      title: 'Visit Us',
      details: '123 AI Street, Tech City',
      description: 'Come say hello at our office',
      action: 'https://maps.google.com'
    },
    {
      icon: <Schedule sx={{ fontSize: 30 }} />,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Instant support with our AI assistant',
      action: '#chat'
    }
  ];

  const features = [
    {
      title: "AI-Powered Support",
      description: "Our intelligent assistant can resolve most queries instantly"
    },
    {
      title: "Real-Time Order Tracking",
      description: "Get live updates on your food delivery with our advanced tracking system"
    },
    {
      title: "Personalized Recommendations",
      description: "Receive tailored food suggestions based on your preferences and order history"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      pt: 4, 
      pb: 8, 
      minHeight: '100vh',
      // Enhanced background with gradient and animated elements
      background: `
        ${colors.backgroundGradient},
        radial-gradient(circle at 15% 50%, ${alpha(colors.primary, 0.15)} 0%, transparent 30%),
        radial-gradient(circle at 85% 30%, ${alpha(colors.accent, 0.1)} 0%, transparent 30%),
        radial-gradient(circle at 50% 80%, ${alpha(colors.secondary, 0.1)} 0%, transparent 40%)
      `,
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, ${alpha(colors.primary, 0.05)} 0%, transparent 20%),
          radial-gradient(circle at 80% 80%, ${alpha(colors.accent, 0.05)} 0%, transparent 20%)
        `,
        animation: 'float 20s infinite ease-in-out',
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' }
        },
        pointerEvents: 'none'
      }} />
      
      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `twinkle ${3 + Math.random() * 4}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 2}s`,
            '@keyframes twinkle': {
              '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
              '50%': { opacity: 0.8, transform: 'scale(1.5)' }
            }
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8, pt: 4 }}>
            <Chip 
              label="Contact Us" 
              sx={{ 
                bgcolor: alpha(colors.primary, 0.2), 
                color: colors.primary, 
                mb: 3, 
                px: 2, 
                py: 1,
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.primary, 0.3)}`
              }} 
            />
            <Typography variant="h2" sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Get in Touch
            </Typography>
            <Typography variant="h6" sx={{ color: colors.textSecondary, maxWidth: 600, mx: 'auto' }}>
              Have questions about our AI-powered food delivery platform? We're here to help you
            </Typography>
          </Box>
        </Fade>

        {/* Contact Methods */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {contactMethods.map((method, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Slide in timeout={800} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
                <Card sx={{ 
                  height: '100%', 
                  bgcolor: colors.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.cardBorder}`,
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 16px 40px ${alpha(colors.primary, 0.2)}`,
                    borderColor: colors.primary,
                    background: `linear-gradient(145deg, ${alpha(colors.primary, 0.1)} 0%, ${colors.cardBg} 100%)`
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      color: 'white',
                      boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`
                    }}>
                      {method.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: colors.textPrimary }}>
                      {method.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.primary, mb: 1, fontWeight: 600 }}>
                      {method.details}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      {method.description}
                    </Typography>
                    <Button
                      href={method.action}
                      endIcon={<ArrowForward />}
                      sx={{
                        color: colors.primary,
                        fontWeight: 600,
                        '&:hover': {
                          color: colors.secondary,
                          background: alpha(colors.primary, 0.1)
                        }
                      }}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={1000}>
              <Card sx={{ 
                bgcolor: colors.cardBg,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colors.cardBorder}`,
                p: { xs: 3, md: 4 },
                borderRadius: 2,
                boxShadow: `0 20px 40px ${alpha('#000', 0.2)}`
              }}>
                <Typography variant="h4" gutterBottom sx={{ 
                  color: colors.textPrimary, 
                  mb: 3,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Send us a Message
                </Typography>

                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Alert 
                        severity={submitStatus} 
                        sx={{ 
                          mb: 3,
                          background: submitStatus === 'success' 
                            ? alpha('#4caf50', 0.2) 
                            : alpha('#f44336', 0.2),
                          color: 'white',
                          border: `1px solid ${submitStatus === 'success' 
                            ? alpha('#4caf50', 0.3) 
                            : alpha('#f44336', 0.3)}`,
                          backdropFilter: 'blur(10px)'
                        }}
                        action={
                          <IconButton
                            size="small"
                            onClick={() => setSubmitStatus(null)}
                            sx={{ color: 'white' }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        }
                      >
                        {submitStatus === 'success' 
                          ? 'Message sent successfully! We will get back to you soon.' 
                          : 'There was an error sending your message. Please try again.'
                        }
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box component="form" ref={formRef} onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': {
                              borderColor: colors.cardBorder,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: colors.textSecondary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': {
                              borderColor: colors.cardBorder,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: colors.textSecondary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': {
                              borderColor: colors.cardBorder,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: colors.textSecondary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': {
                              borderColor: colors.cardBorder,
                            },
                            '&:hover fieldset': {
                              borderColor: colors.primary,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                              boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: colors.textSecondary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          fullWidth
                          size="large"
                          variant="contained"
                          disabled={isSubmitting}
                          endIcon={isSubmitting ? <></> : <Send />}
                          sx={{
                            py: 2,
                            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
                              boxShadow: `0 12px 30px ${alpha(colors.primary, 0.4)}`,
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Fade>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1000} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Feature Carousel */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: colors.textPrimary, mb: 3 }}>
                    Why Choose GenAI Food?
                  </Typography>
                  <Box sx={{ position: 'relative', height: 120 }}>
                    <AnimatePresence mode='wait'>
                      <motion.div
                        key={currentFeature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ color: colors.primary, mb: 1 }}>
                            {features[currentFeature].title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                            {features[currentFeature].description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </Box>

                <Divider sx={{ my: 4, bgcolor: colors.cardBorder }} />

                {/* Support Info */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: colors.textPrimary, mb: 2 }}>
                    Support Hours
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SupportAgent sx={{ color: colors.primary, mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: colors.textPrimary }}>24/7 AI Support</Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>Instant assistance anytime</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Schedule sx={{ color: colors.primary, mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: colors.textPrimary }}>Human Support</Typography>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>Mon-Fri, 8:00 AM - 8:00 PM EST</Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 4, bgcolor: colors.cardBorder }} />

                {/* Map Placeholder */}
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: colors.textPrimary, mb: 2 }}>
                    Our Location
                  </Typography>
                  <Box sx={{ 
                    height: 200, 
                    background: `linear-gradient(135deg, ${alpha(colors.primary, 0.2)} 0%, ${alpha(colors.accent, 0.2)} 100%)`, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.cardBorder}`
                  }}>
                    <Typography sx={{ color: colors.textSecondary }}>
                      Interactive Map Here
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Live Chat Button */}
        <Zoom in timeout={1000}>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
              }
            }}
          >
            <Chat />
          </Fab>
        </Zoom>
      </Container>
    </Box>
  );
};

export default ContactPage;