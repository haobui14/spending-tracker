import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  Slide,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Analytics,
  CloudSync,
  Language as LanguageIcon,
  ArrowForward,
} from '@mui/icons-material';
import Footer from '../components/Footer';
import { colors } from '../theme';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: colors.primary.main }} />,
      title: t('smartTracking'),
      description: t('smartTrackingDesc'),
    },
    {
      icon: <Security sx={{ fontSize: 40, color: colors.financial.paid.main }} />,
      title: t('secureData'),
      description: t('secureDataDesc'),
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: colors.financial.partial.main }} />,
      title: t('detailedAnalytics'),
      description: t('detailedAnalyticsDesc'),
    },
    {
      icon: <CloudSync sx={{ fontSize: 40, color: colors.primary.light }} />,
      title: t('cloudSync'),
      description: t('cloudSyncDesc'),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Language Toggle Button */}
      <Tooltip title={`${t('language')}: ${language === 'en' ? t('english') : t('vietnamese')}`}>
        <IconButton
          onClick={toggleLanguage}
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            zIndex: 10,
            '&:hover': {
              bgcolor: '#f8fafc',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <LanguageIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Tooltip>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 8, md: 12 } }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 20px 40px ${colors.primary.main}20`,
                  mb: 3,
                }}
              >
                <img
                  src="/pwa-192x192.png"
                  alt="SpendingTracker Pro"
                  style={{
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                  }}
                />
              </Box>
            </Box>
            
            <Typography
              variant="h2"
              component="h1"
              fontWeight={800}
              sx={{
                mb: 3,
                color: '#1e293b',
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.1,
              }}
            >
              SpendingTracker Pro
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 6,
                color: '#64748b',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              {t('welcomeSubtitle')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  backgroundColor: colors.primary.main,
                  boxShadow: `0 8px 24px ${colors.primary.main}30`,
                  '&:hover': {
                    backgroundColor: colors.primary.dark,
                    boxShadow: `0 12px 32px ${colors.primary.main}40`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('getStarted')}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/demo')}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.main,
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('viewDemo')}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Features Section */}
        <Slide direction="up" in timeout={1000}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              fontWeight={700}
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {t('whyChooseUs')}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 8,
                textAlign: 'center',
                color: '#64748b',
                fontWeight: 400,
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              {t('whyChooseUsDesc')}
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 2, color: '#1e293b' }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#64748b', lineHeight: 1.6 }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>
      </Container>

      <Footer />
    </Box>
  );
}
