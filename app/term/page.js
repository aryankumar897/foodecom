
"use client"
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Fade,
  Slide,
  Grid,
  Zoom,
  useTheme,
  alpha,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore,
  ArrowForward,
  CheckCircle,
  Cancel,
  PrivacyTip,
  Security,
  Cookie,
  Gavel,
  Description,
  Download,
  Share,
  Print,
  Help
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const TermsAndConditionsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [acceptedSections, setAcceptedSections] = useState({});
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedSection, setHighlightedSection] = useState(null);
  const contentRef = useRef();

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

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Description />,
      content: `Welcome to GenAI Food ("we," "our," or "us"). These Terms and Conditions govern your use of our AI-powered food delivery platform. By accessing or using our services, you agree to be bound by these terms.`
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: <Help />,
      content: `"Platform" refers to our website, mobile application, and related services. "User" means any individual or entity using our services. "Content" includes text, images, reviews, and other materials.`
    },
    {
      id: 'account',
      title: 'Account Registration',
      icon: <PrivacyTip />,
      content: `You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`
    },
    {
      id: 'orders',
      title: 'Order Placement & Payments',
      icon: <CheckCircle />,
      content: `Orders are subject to acceptance and availability. Payment must be made at the time of ordering. We use secure payment processing, but we are not responsible for issues with third-party payment providers.`
    },
    {
      id: 'ai',
      title: 'AI Recommendations',
      icon: <Security />,
      content: `Our AI provides personalized food recommendations based on your preferences. These are suggestions only and we don't guarantee suitability for dietary restrictions or allergies.`
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: <PrivacyTip />,
      content: `We collect and use your data as described in our Privacy Policy. By using our services, you consent to our data practices, including the use of AI to analyze your preferences.`
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <Cookie />,
      content: `We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can manage your cookie preferences in your account settings.`
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Gavel />,
      content: `To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of our services.`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <Cancel />,
      content: `We may suspend or terminate your account at our discretion if you violate these terms. You may terminate your account at any time through your account settings.`
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: <Description />,
      content: `We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the modified terms.`
    }
  ];

  const stats = [
    { value: 'Last Updated', label: 'March 15, 2024' },
    { value: 'Version', label: '3.2.1' },
    { value: 'Pages', label: '12' },
    { value: 'Languages', label: '5' }
  ];

  useEffect(() => {
    // Set last read time
    setLastRead(new Date().toLocaleDateString());
    
    // Auto-scroll to section when highlighted
    if (highlightedSection) {
      const element = document.getElementById(highlightedSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        element.style.backgroundColor = alpha(colors.primary, 0.2);
        setTimeout(() => {
          if (element) element.style.backgroundColor = 'transparent';
        }, 2000);
      }
    }
  }, [highlightedSection, colors.primary]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const foundSection = sections.find(section => 
        section.title.toLowerCase().includes(term.toLowerCase()) || 
        section.content.toLowerCase().includes(term.toLowerCase())
      );
      if (foundSection) {
        setHighlightedSection(foundSection.id);
        setActiveSection(foundSection.id);
      }
    }
  };

  const toggleAcceptSection = (sectionId) => {
    setAcceptedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const allSectionsAccepted = sections.every(section => acceptedSections[section.id]);

  const SectionCard = ({ section, index }) => (
    <motion.div
      id={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
    >
      <Card sx={{
        mb: 3,
        bgcolor: colors.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${activeSection === section.id ? colors.primary : colors.cardBorder}`,
        transition: 'all 0.3s ease',
        borderRadius: 2,
        '&:hover': {
          borderColor: colors.primary,
          boxShadow: `0 8px 25px ${alpha(colors.primary, 0.15)}`
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 2,
              bgcolor: alpha(colors.primary, 0.2),
              color: colors.primary,
              mr: 2,
              flexShrink: 0
            }}>
              {section.icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ color: colors.textPrimary, mb: 1 }}>
                {section.title}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {section.content}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!acceptedSections[section.id]}
                  onChange={() => toggleAcceptSection(section.id)}
                  icon={<Box sx={{ width: 24, height: 24, border: `2px solid ${colors.textSecondary}`, borderRadius: 1 }} />}
                  checkedIcon={<CheckCircle sx={{ color: colors.primary }} />}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  I understand this section
                </Typography>
              }
            />
            
            <Chip 
              label={`Section ${index + 1}`} 
              size="small" 
              sx={{ 
                bgcolor: alpha(colors.primary, 0.2), 
                color: colors.primary 
              }} 
            />
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
        radial-gradient(circle at 10% 20%, ${alpha(colors.primary, 0.08)} 0%, transparent 25%),
        radial-gradient(circle at 90% 80%, ${alpha(colors.accent, 0.08)} 0%, transparent 25%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6, pt: 4 }}>
            <Chip 
              label="Legal Documents" 
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
              Terms & Conditions
            </Typography>
            <Typography variant="h6" sx={{ color: colors.textSecondary, maxWidth: 700, mx: 'auto', mb: 4 }}>
              Please read these terms carefully before using our AI-powered food delivery services
            </Typography>
          </Box>
        </Fade>

        {/* Stats Section */}
        <Slide in timeout={1000} direction="up">
          <Grid container spacing={3} sx={{ mb: 6 }}>
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
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: colors.primary,
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Slide>

        {/* Search and Controls */}
        <Box sx={{ 
          mb: 6, 
          p: 3, 
          bgcolor: colors.cardBg, 
          borderRadius: 2, 
          border: `1px solid ${colors.cardBorder}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button startIcon={<Download />} sx={{ color: colors.textSecondary }}>
                Download PDF
              </Button>
              <Button startIcon={<Print />} sx={{ color: colors.textSecondary }}>
                Print
              </Button>
              <Button startIcon={<Share />} sx={{ color: colors.textSecondary }}>
                Share
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Last read: {lastRead}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={6}>
          {/* Navigation Sidebar */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Card sx={{ 
                position: 'sticky',
                top: 100,
                bgcolor: colors.cardBg,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 2
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 3 }}>
                    Table of Contents
                  </Typography>
                  
                  <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Box
                          onClick={() => {
                            setActiveSection(section.id);
                            document.getElementById(section.id)?.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'center' 
                            });
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            mb: 1,
                            borderRadius: 1,
                            cursor: 'pointer',
                            bgcolor: activeSection === section.id ? alpha(colors.primary, 0.2) : 'transparent',
                            borderLeft: `3px solid ${activeSection === section.id ? colors.primary : 'transparent'}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: alpha(colors.primary, 0.1)
                            }
                          }}
                        >
                          <Box sx={{ color: colors.primary, mr: 2 }}>
                            {section.icon}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: activeSection === section.id ? colors.primary : colors.textSecondary,
                              fontWeight: activeSection === section.id ? 600 : 400
                            }}
                          >
                            {section.title}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  <Divider sx={{ my: 3, bgcolor: colors.cardBorder }} />

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                      {Object.keys(acceptedSections).filter(k => acceptedSections[k]).length} of {sections.length} sections understood
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!allSectionsAccepted}
                      onClick={() => setShowAcceptDialog(true)}
                      sx={{
                        py: 1.5,
                        background: allSectionsAccepted 
                          ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                          : alpha(colors.textSecondary, 0.3),
                        '&:hover': allSectionsAccepted ? {
                          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`
                        } : {}
                      }}
                    >
                      Accept All Terms
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Box ref={contentRef}>
              {sections.map((section, index) => (
                <SectionCard key={section.id} section={section} index={index} />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Acceptance Dialog */}
        <Dialog 
          open={showAcceptDialog} 
          onClose={() => setShowAcceptDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            color: 'white',
            fontWeight: 600
          }}>
            Confirm Acceptance
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              By accepting these terms, you agree to be legally bound by all provisions outlined in our Terms and Conditions.
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              This includes our privacy practices, AI usage policies, and service terms. You can review these terms at any time in your account settings.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowAcceptDialog(false)}
              sx={{ color: colors.textSecondary }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowAcceptDialog(false);
                // Here you would typically handle the acceptance
                console.log('Terms accepted');
              }}
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.primary} 100%)`
                }
              }}
            >
              I Accept
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TermsAndConditionsPage;