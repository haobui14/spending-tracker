import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Language as LanguageIcon,
  ArrowBack,
  Share,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { colors } from '../theme';

export default function DemoPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  // Sample demo data
  const demoData = {
    dashboardName: 'Sample Company - January 2025',
    tabs: [
      {
        name: 'Office Expenses',
        items: [
          { name: 'Office Rent', amount: 2500, status: 'paid', notes: 'Monthly office lease payment' },
          { name: 'Utilities', amount: 350, status: 'paid', notes: 'Electricity, water, internet' },
          { name: 'Office Supplies', amount: 180, status: 'partial', paidAmount: 100, notes: 'Stationery and equipment' },
          { name: 'Cleaning Service', amount: 200, status: 'unpaid', notes: 'Weekly office cleaning' },
        ]
      },
      {
        name: 'Staff & Payroll',
        items: [
          { name: 'Salaries', amount: 15000, status: 'paid', notes: 'Monthly staff salaries' },
          { name: 'Health Insurance', amount: 800, status: 'paid', notes: 'Employee health benefits' },
          { name: 'Training Budget', amount: 500, status: 'partial', paidAmount: 250, notes: 'Professional development courses' },
        ]
      },
      {
        name: 'Marketing',
        items: [
          { name: 'Digital Advertising', amount: 1200, status: 'paid', notes: 'Google Ads and Facebook campaigns' },
          { name: 'Website Maintenance', amount: 300, status: 'unpaid', notes: 'Monthly hosting and updates' },
          { name: 'Print Materials', amount: 450, status: 'partial', paidAmount: 200, notes: 'Brochures and business cards' },
        ]
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return colors.financial.paid;
      case 'unpaid':
        return colors.financial.unpaid;
      case 'partial':
        return colors.financial.partial;
      default:
        return colors.neutral;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return t('paid');
      case 'unpaid':
        return t('unpaid');
      case 'partial':
        return t('partiallyPaid');
      default:
        return status;
    }
  };

  const calculateTotals = () => {
    let totalAmount = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;

    demoData.tabs.forEach(tab => {
      tab.items.forEach(item => {
        totalAmount += item.amount;
        if (item.status === 'paid') {
          paidAmount += item.amount;
        } else if (item.status === 'partial') {
          paidAmount += item.paidAmount || 0;
          unpaidAmount += item.amount - (item.paidAmount || 0);
        } else {
          unpaidAmount += item.amount;
        }
      });
    });

    return { totalAmount, paidAmount, unpaidAmount };
  };

  const { totalAmount, paidAmount, unpaidAmount } = calculateTotals();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.neutral[50],
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${colors.neutral[200]}`,
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  bgcolor: colors.neutral[100],
                  '&:hover': { bgcolor: colors.neutral[200] },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h6" fontWeight={600} color={colors.neutral[900]}>
                  SpendingTracker Pro - Demo
                </Typography>
                <Typography variant="body2" color={colors.neutral[600]}>
                  {demoData.dashboardName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={`${t('language')}: ${language === 'en' ? t('english') : t('vietnamese')}`}>
                <IconButton
                  onClick={toggleLanguage}
                  sx={{
                    bgcolor: colors.neutral[100],
                    '&:hover': { bgcolor: colors.neutral[200] },
                  }}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                startIcon={<Share />}
                disabled
                sx={{ borderColor: colors.neutral[300], color: colors.neutral[500] }}
              >
                Demo Mode
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Summary Cards */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ border: `1px solid ${colors.neutral[200]}` }}>
              <CardContent>
                <Typography variant="body2" color={colors.neutral[600]} gutterBottom>
                  {t('totalAmountLabel')}
                </Typography>
                <Typography variant="h4" fontWeight={700} color={colors.neutral[900]}>
                  ${totalAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ border: `1px solid ${colors.financial.paid.border}`, bgcolor: colors.financial.paid.background }}>
              <CardContent>
                <Typography variant="body2" color={colors.financial.paid.text} gutterBottom>
                  {t('paidAmountLabel')}
                </Typography>
                <Typography variant="h4" fontWeight={700} color={colors.financial.paid.text}>
                  ${paidAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ border: `1px solid ${colors.financial.unpaid.border}`, bgcolor: colors.financial.unpaid.background }}>
              <CardContent>
                <Typography variant="body2" color={colors.financial.unpaid.text} gutterBottom>
                  {t('unpaidAmountLabel')}
                </Typography>
                <Typography variant="h4" fontWeight={700} color={colors.financial.unpaid.text}>
                  ${unpaidAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Demo Data Tabs */}
        {demoData.tabs.map((tab, tabIndex) => (
          <Card key={tabIndex} sx={{ mb: 3, border: `1px solid ${colors.neutral[200]}` }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${colors.neutral[200]}`, bgcolor: colors.neutral[50] }}>
              <Typography variant="h6" fontWeight={600} color={colors.neutral[900]}>
                {tab.name}
              </Typography>
            </Box>
            <Box sx={{ p: 0 }}>
              {tab.items.map((item, itemIndex) => (
                <Card
                  key={itemIndex}
                  variant="outlined"
                  sx={{
                    border: `1px solid ${colors.neutral[200]}`,
                    backgroundColor: 'white',
                    '&:hover': { boxShadow: 2 },
                    borderRadius: 0,
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: itemIndex === 0 ? 'none' : `1px solid ${colors.neutral[200]}`,
                    borderBottom: 'none',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography variant="body1" fontWeight={600} color={colors.neutral[900]} gutterBottom>
                          {item.name}
                        </Typography>
                        {item.notes && (
                          <Typography variant="body2" color={colors.neutral[600]} sx={{ mb: 1 }}>
                            {item.notes}
                          </Typography>
                        )}
                        {item.status === 'partial' && item.paidAmount && (
                          <Typography variant="body2" color={colors.financial.partial.text} sx={{ mb: 1 }}>
                            Paid: ${item.paidAmount.toLocaleString()} of ${item.amount.toLocaleString()}
                          </Typography>
                        )}
                        <Chip
                          label={getStatusLabel(item.status)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(item.status).background,
                            color: getStatusColor(item.status).text,
                            border: `1px solid ${getStatusColor(item.status).border}`,
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight={700} color={colors.neutral[900]}>
                          ${item.amount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color={colors.neutral[500]}>
                          Amount
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Card>
        ))}

        {/* Demo Notice */}
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 3,
            bgcolor: colors.primary.main + '10',
            borderRadius: 3,
            border: `1px solid ${colors.primary.main}30`,
          }}
        >
          <Typography variant="h6" fontWeight={600} color={colors.primary.dark} gutterBottom>
            📊 This is a Demo Dashboard
          </Typography>
          <Typography variant="body1" color={colors.neutral[600]} sx={{ mb: 3 }}>
            This dashboard shows sample data to demonstrate SpendingTracker Pro's features. 
            Create your free account to start tracking your own expenses!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: colors.primary.main,
              '&:hover': { backgroundColor: colors.primary.dark },
              px: 4,
            }}
          >
            {t('getStarted')}
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
