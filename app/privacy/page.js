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
  Zoom,
  useTheme,
  alpha,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore,
  ArrowForward,
  CheckCircle,
  PrivacyTip,
  Security,
  Cookie,
  DataUsage,
  Visibility,
  VisibilityOff,
  Download,
  Share,
  Print,
  Help,
  Lock,
  Encryption,
  Delete,
  Edit,
  History
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicyPage = () => {
  const [activeTab, setActiveTab] = useState('policy');
  const [consentSettings, setConsentSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: true,
    cookies: false
  });
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [dataPreferences, setDataPreferences] = useState({
    dataSharing: false,
    dataRetention: '1year',
    dataExport: true
  });
  const [lastUpdated] = useState('March 15, 2024');

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

  const policySections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <PrivacyTip />,
      content: `At GenAI Food, we prioritize your privacy. This policy explains how we collect, use, and protect your personal information when you use our AI-powered food delivery platform.`,
      lastUpdated: '2024-03-15'
    },
    {
      id: 'data-collection',
      title: 'Data We Collect',
      icon: <DataUsage />,
      content: `We collect information you provide directly, automatically through your usage, and from third parties. This includes order history, preferences, device information, and location data to enhance your experience.`,
      sensitive: true
    },
    {
      id: 'ai-usage',
      title: 'AI & Machine Learning',
      icon: <Security />,
      content: `Our AI systems analyze your preferences to provide personalized recommendations. We use advanced algorithms to improve our services while maintaining your privacy through data anonymization techniques.`,
      important: true
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: <Cookie />,
      content: `We use cookies and similar technologies to remember your preferences, analyze trends, and personalize your experience. You can control these settings through your account dashboard.`
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      icon: <Share />,
      content: `We may share your information with restaurant partners, delivery services, and payment processors only as necessary to fulfill your orders. We never sell your personal data to third parties.`,
      sensitive: true
    },
    {
      id: 'security',
      title: 'Security Measures',
      icon: <Lock />,
      content: `We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data from unauthorized access or disclosure.`
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: <Edit />,
      content: `You have the right to access, correct, delete, or export your personal data. You can also object to or restrict certain processing activities through your account settings.`,
      important: true
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <History />,
      content: `We retain your personal data only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.`
    },
    {
      id: 'children',
      title: "Children's Privacy",
      icon: <VisibilityOff />,
      content: `Our services are not directed to individuals under 16. We do not knowingly collect personal information from children without parental consent.`
    },
    {
      id: 'changes',
      title: 'Policy Updates',
      icon: <Help />,
      content: `We may update this policy periodically. We will notify you of significant changes through email or in-app notifications and obtain consent when required by law.`
    }
  ];

  const privacyTools = [
    {
      title: 'Data Export',
      description: 'Download all your personal data in a portable format',
      icon: <Download />,
      action: () => console.log('Export data')
    },
    {
      title: 'Privacy Settings',
      description: 'Customize your privacy preferences and consents',
      icon: <PrivacyTip />,
      action: () => setShowConsentDialog(true)
    },
    {
      title: 'Account Deletion',
      description: 'Permanently delete your account and associated data',
      icon: <Delete />,
      action: () => console.log('Delete account'),
      warning: true
    }
  ];

  const stats = [
    { value: 'Last Updated', label: lastUpdated },
    { value: 'Data Points', label: '42 protected' },
    { value: 'Encryption', label: 'AES-256' },
    { value: 'Compliance', label: 'GDPR, CCPA' }
  ];

  const handleConsentChange = (setting) => {
    setConsentSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const ConsentSwitch = ({ label, value, onChange, required }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 1, bgcolor: alpha(colors.primary, 0.05), mb: 1 }}>
      <Box>
        <Typography variant="body1" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
          {label}
          {required && <Box component="span" sx={{ color: colors.primary, ml: 0.5 }}>*</Box>}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
          {value ? 'Enabled' : 'Disabled'}
        </Typography>
      </Box>
      <Switch
        checked={value}
        onChange={onChange}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: colors.primary,
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: colors.primary,
          },
        }}
      />
    </Box>
  );

  const PolicySection = ({ section, index }) => (
    <motion.div
      id={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card sx={{
        mb: 3,
        bgcolor: colors.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.cardBorder}`,
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
              bgcolor: alpha(section.important ? colors.accent : colors.primary, 0.2),
              color: section.important ? colors.accent : colors.primary,
              mr: 2,
              flexShrink: 0
            }}>
              {section.icon}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ color: colors.textPrimary }}>
                  {section.title}
                </Typography>
                {section.important && (
                  <Chip label="Important" size="small" sx={{ bgcolor: alpha(colors.accent, 0.2), color: colors.accent }} />
                )}
                {section.sensitive && (
                  <Chip label="Sensitive" size="small" sx={{ bgcolor: alpha(colors.primary, 0.2), color: colors.primary }} />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                {section.content}
              </Typography>
              {section.lastUpdated && (
                <Typography variant="caption" sx={{ color: alpha(colors.textSecondary, 0.7), mt: 1, display: 'block' }}>
                  Last updated: {section.lastUpdated}
                </Typography>
              )}
            </Box>
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
        radial-gradient(circle at 15% 30%, ${alpha(colors.primary, 0.08)} 0%, transparent 25%),
        radial-gradient(circle at 85% 70%, ${alpha(colors.accent, 0.08)} 0%, transparent 25%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6, pt: 4 }}>
            <Chip 
              label="Privacy Center" 
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
              Privacy Policy
            </Typography>
            <Typography variant="h6" sx={{ color: colors.textSecondary, maxWidth: 700, mx: 'auto', mb: 4 }}>
              Your privacy is our priority. Learn how we protect your data and empower your choices.
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

        {/* Tabs Navigation */}
        <Box sx={{ 
          mb: 6, 
          borderBottom: `1px solid ${colors.cardBorder}`,
          background: colors.cardBg,
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': { color: colors.textSecondary },
              '& .Mui-selected': { color: colors.primary + '!important' },
              '& .MuiTabs-indicator': { backgroundColor: colors.primary }
            }}
          >
            <Tab label="Privacy Policy" value="policy" />
            <Tab label="Privacy Tools" value="tools" />
            <Tab label="Consent Settings" value="consent" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {activeTab === 'policy' && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={6}>
                <Grid item xs={12} md={3}>
                  <Fade in timeout={1000}>
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
                          Policy Sections
                        </Typography>
                        
                        <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                          {policySections.map((section) => (
                            <motion.div
                              key={section.id}
                              whileHover={{ x: 5 }}
                            >
                              <Box
                                onClick={() => {
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
                                  bgcolor: alpha(colors.primary, 0.1),
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    bgcolor: alpha(colors.primary, 0.15)
                                  }
                                }}
                              >
                                <Box sx={{ color: colors.primary, mr: 2, fontSize: 20 }}>
                                  {section.icon}
                                </Box>
                                <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                                  {section.title}
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>

                <Grid item xs={12} md={9}>
                  <Box>
                    {policySections.map((section, index) => (
                      <PolicySection key={section.id} section={section} index={index} />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {privacyTools.map((tool, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card sx={{
                        height: '100%',
                        bgcolor: colors.cardBg,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${colors.cardBorder}`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: tool.warning ? colors.accent : colors.primary,
                          boxShadow: `0 8px 25px ${alpha(tool.warning ? colors.accent : colors.primary, 0.15)}`
                        }
                      }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'inline-flex', 
                            p: 2, 
                            mb: 3, 
                            borderRadius: 2,
                            bgcolor: alpha(tool.warning ? colors.accent : colors.primary, 0.2),
                            color: tool.warning ? colors.accent : colors.primary
                          }}>
                            {tool.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
                            {tool.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                            {tool.description}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={tool.action}
                            sx={{
                              color: tool.warning ? colors.accent : colors.primary,
                              borderColor: tool.warning ? colors.accent : colors.primary,
                              '&:hover': {
                                borderColor: tool.warning ? colors.accent : colors.primary,
                                bgcolor: alpha(tool.warning ? colors.accent : colors.primary, 0.1)
                              }
                            }}
                          >
                            {tool.warning ? 'Proceed Carefully' : 'Get Started'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 'consent' && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    bgcolor: colors.cardBg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 2
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ color: colors.textPrimary, mb: 3, display: 'flex', alignItems: 'center' }}>
                        <PrivacyTip sx={{ mr: 1, color: colors.primary }} />
                        Consent Preferences
                      </Typography>
                      
                      <ConsentSwitch
                        label="Essential Cookies"
                        value={consentSettings.essential}
                        onChange={() => handleConsentChange('essential')}
                        required
                      />
                      <ConsentSwitch
                        label="Analytics Cookies"
                        value={consentSettings.analytics}
                        onChange={() => handleConsentChange('analytics')}
                      />
                      <ConsentSwitch
                        label="Marketing Cookies"
                        value={consentSettings.marketing}
                        onChange={() => handleConsentChange('marketing')}
                      />
                      <ConsentSwitch
                        label="Personalization"
                        value={consentSettings.personalization}
                        onChange={() => handleConsentChange('personalization')}
                      />
                      <ConsentSwitch
                        label="Third-Party Cookies"
                        value={consentSettings.cookies}
                        onChange={() => handleConsentChange('cookies')}
                      />

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
                        onClick={() => console.log('Consent saved', consentSettings)}
                      >
                        Save Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    bgcolor: colors.cardBg,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${colors.cardBorder}`,
                    borderRadius: 2
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ color: colors.textPrimary, mb: 3, display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1, color: colors.primary }} />
                        Data Preferences
                      </Typography>

                      <Accordion sx={{ bgcolor: 'transparent', color: colors.textPrimary, mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: colors.primary }} />}>
                          <Typography>Data Sharing Preferences</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Control how your data is shared with our partners for service improvement.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion sx={{ bgcolor: 'transparent', color: colors.textPrimary, mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: colors.primary }} />}>
                          <Typography>Data Retention Settings</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Choose how long we keep your data before automatic deletion.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion sx={{ bgcolor: 'transparent', color: colors.textPrimary }}>
                        <AccordionSummary expandIcon={<ExpandMore sx={{ color: colors.primary }} />}>
                          <Typography>Export Settings</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Configure automatic data export preferences and formats.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;