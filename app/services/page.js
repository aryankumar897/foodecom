"use client"

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  IconButton,
  Divider
} from '@mui/material';
import {
  Restaurant,
  LocalShipping,
  SmartToy,
  ShoppingCart,
  SupportAgent,
  RestaurantMenu,
  HealthAndSafety,
  Business,
  Event,
  Groups,
  ArrowForward,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const videoRef = useRef(null);

  // Enhanced color palette
  const colors = {
    primary: '#ff3b30',
    secondary: '#ff6b6b',
    dark: '#cc0000',
    accent: '#ff9f43',
    backgroundGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)'
  };

  const serviceCategories = [
    { id: 'all', label: 'All Services' },
    { id: 'delivery', label: 'Food Delivery' },
    { id: 'ai', label: 'AI Solutions' },
    { id: 'business', label: 'Business' },
    { id: 'premium', label: 'Premium' }
  ];

  const services = [
    {
      id: 1,
      title: 'Instant Food Delivery',
      description: 'Get your favorite meals delivered in under 30 minutes with our optimized delivery network',
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      category: 'delivery',
      features: ['30-min delivery', 'Real-time tracking', 'Temperature control'],
      price: 'From $2.99',
      popular: true
    },
    {
      id: 2,
      title: 'AI Meal Recommendations',
      description: 'Personalized food suggestions based on your preferences, dietary needs, and order history',
      icon: <SmartToy sx={{ fontSize: 40 }} />,
      category: 'ai',
      features: ['Personalized suggestions', 'Nutrition analysis', 'Allergy alerts'],
      price: 'Free'
    },
    {
      id: 3,
      title: 'Grocery Delivery',
      description: 'Fresh groceries delivered to your doorstep with same-day delivery options',
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      category: 'delivery',
      features: ['Fresh produce', 'Same-day delivery', 'Quality guarantee'],
      price: 'From $4.99'
    },
    {
      id: 4,
      title: 'VIP Priority Service',
      description: 'Skip the lines and get priority treatment with our premium service tier',
      icon: <SupportAgent sx={{ fontSize: 40 }} />,
      category: 'premium',
      features: ['Priority delivery', 'Dedicated support', 'Exclusive offers'],
      price: '$9.99/month'
    },
    {
      id: 5,
      title: 'Meal Plan Subscription',
      description: 'Weekly curated meal plans with automatic delivery and nutritional balance',
      icon: <RestaurantMenu sx={{ fontSize: 40 }} />,
      category: 'premium',
      features: ['Weekly plans', 'Nutrition balanced', 'Auto-delivery'],
      price: '$12.99/week'
    },
    {
      id: 6,
      title: 'Corporate Catering',
      description: 'Professional catering services for businesses and corporate events',
      icon: <Business sx={{ fontSize: 40 }} />,
      category: 'business',
      features: ['Bulk orders', 'Custom menus', 'Professional setup'],
      price: 'Custom quote'
    },
    {
      id: 7,
      title: 'Health & Nutrition',
      description: 'Specialized meals for dietary restrictions and health goals',
      icon: <HealthAndSafety sx={{ fontSize: 40 }} />,
      category: 'premium',
      features: ['Diet-specific meals', 'Nutritionist approved', 'Calorie controlled'],
      price: '$15.99/meal'
    },
    {
      id: 8,
      title: 'Event Catering',
      description: 'Complete catering solutions for weddings, parties, and special events',
      icon: <Event sx={{ fontSize: 40 }} />,
      category: 'business',
      features: ['Event planning', 'Custom menus', 'Staff service'],
      price: 'Custom quote'
    },
    {
      id: 9,
      title: 'AI Chef Assistant',
      description: 'Virtual cooking assistant that helps you prepare meals with guided instructions',
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      category: 'ai',
      features: ['Step-by-step guidance', 'Ingredient tracking', 'Cooking tips'],
      price: '$4.99/month'
    },
    {
      id: 10,
      title: 'Group Ordering',
      description: 'Simplify group meals with collaborative ordering and split billing',
      icon: <Groups sx={{ fontSize: 40 }} />,
      category: 'business',
      features: ['Collaborative orders', 'Split billing', 'Order management'],
      price: 'Free'
    }
  ];

  const features = [
    {
      title: "AI-Powered Delivery Optimization",
      description: "Our algorithms calculate the fastest routes in real-time"
    },
    {
      title: "Smart Temperature Control",
      description: "Maintain perfect food temperature during delivery"
    },
    {
      title: "Personalized Nutrition Tracking",
      description: "Monitor your dietary goals with AI-powered insights"
    }
  ];

  const stats = [
    { value: '500+', label: 'Restaurant Partners' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '25min', label: 'Average Delivery Time' },
    { value: '24/7', label: 'Support Availability' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const ServiceCard = ({ service }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card sx={{
        height: '100%',
        bgcolor: colors.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.cardBorder}`,
        transition: 'all 0.3s ease',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: colors.primary,
          boxShadow: `0 16px 40px ${alpha(colors.primary, 0.2)}`,
          '&::before': {
            opacity: 1
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
          opacity: service.popular ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }
      }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {service.popular && (
            <Chip 
              label="Most Popular" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                bgcolor: colors.primary, 
                color: 'white',
                fontWeight: 600
              }} 
            />
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            background: `linear-gradient(135deg, ${alpha(colors.primary, 0.2)} 0%, transparent 100%)`,
            p: 1,
            borderRadius: 2,
            width: 'fit-content'
          }}>
            <Box sx={{ color: colors.primary }}>
              {service.icon}
            </Box>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: colors.textPrimary, fontWeight: 600 }}>
            {service.title}
          </Typography>

          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2, flexGrow: 1 }}>
            {service.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {service.features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  bgcolor: colors.primary, 
                  mr: 1 
                }} />
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 600 }}>
              {service.price}
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: colors.primary,
                fontWeight: 600,
                '&:hover': {
                  color: colors.secondary,
                  bgcolor: alpha(colors.primary, 0.1)
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ 
      pt: 4, 
      pb: 8, 
      minHeight: '100vh',
      background: `
        ${colors.backgroundGradient},
        radial-gradient(circle at 80% 20%, ${alpha(colors.primary, 0.1)} 0%, transparent 30%),
        radial-gradient(circle at 20% 80%, ${alpha(colors.accent, 0.1)} 0%, transparent 30%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8, pt: 4 }}>
            <Chip 
              label="Our Services" 
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
              AI-Powered Food Services
            </Typography>
            <Typography variant="h6" sx={{ color: colors.textSecondary, maxWidth: 600, mx: 'auto' }}>
              Discover our comprehensive suite of food delivery and AI-powered dining solutions
            </Typography>
          </Box>
        </Fade>

        {/* Stats Section */}
        <Slide in timeout={1000} direction="up">
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  bgcolor: alpha(colors.primary, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: colors.primary,
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Slide>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
          {serviceCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip
                label={category.label}
                onClick={() => setActiveCategory(category.id)}
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: activeCategory === category.id ? colors.primary : alpha(colors.primary, 0.1),
                  color: activeCategory === category.id ? 'white' : colors.primary,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `2px solid ${activeCategory === category.id ? colors.primary : 'transparent'}`,
                  '&:hover': {
                    bgcolor: activeCategory === category.id ? colors.dark : alpha(colors.primary, 0.2)
                  }
                }}
              />
            </motion.div>
          ))}
        </Box>

        {/* Services Grid */}
        <Grid container spacing={3}>
          {filteredServices.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <ServiceCard service={service} />
            </Grid>
          ))}
        </Grid>

        {/* Feature Section */}
        <Box sx={{ mt: 12, mb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ 
                color: colors.textPrimary, 
                mb: 3,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Advanced Technology for Better Dining
              </Typography>
              
              <Box sx={{ position: 'relative', height: 120, mb: 4 }}>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box>
                      <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
                        {features[currentFeature].title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                        {features[currentFeature].description}
                      </Typography>
                    </Box>
                  </motion.div>
                </AnimatePresence>
                
                <IconButton
                  onClick={() => setIsPlaying(!isPlaying)}
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    color: colors.primary 
                  }}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Box>

              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 2,
                  px: 4,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
                    boxShadow: `0 12px 30px ${alpha(colors.primary, 0.4)}`,
                  }
                }}
              >
                Explore Technology
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                ref={videoRef}
                component="video"
                autoPlay
                muted
           
                playsInline
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: `0 20px 40px ${alpha('#000', 0.3)}`,
                  border: `1px solid ${colors.cardBorder}`
                }}
              >
                <source src="/images/ai.mp4" type="video/mp4" />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ 
          textAlign: 'center', 
          p: 6, 
          bgcolor: alpha(colors.primary, 0.1),
          borderRadius: 2,
          border: `1px solid ${alpha(colors.primary, 0.2)}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h3" sx={{ 
            color: colors.textPrimary, 
            mb: 2,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Ready to Transform Your Dining Experience?
          </Typography>
          <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 4, maxWidth: 600, mx: 'auto' }}>
            Join thousands of satisfied customers who are enjoying our AI-powered food services
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`,
                boxShadow: `0 12px 30px ${alpha(colors.primary, 0.4)}`,
              }
            }}
          >
            Get Started Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage;