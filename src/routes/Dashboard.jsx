import React from "react";
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import MonthlySpending from "../components/MonthlySpending";
import ShareDialog from "../components/ShareDialog";
import Footer from "../components/Footer";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import ShareIcon from "@mui/icons-material/Share";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';

export default function Dashboard({ year: propYear, month: propMonth }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [user] = useAuthState(auth);
  const now = new Date();
  const [year, setYear] = useState(propYear || now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState((propMonth || now.getMonth() + 1) - 1); // Convert to 0-11 format
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Debug logging
  console.log('Dashboard render - year:', year, 'selectedMonth:', selectedMonth, 'month for API:', selectedMonth + 1);
  console.log('Current user:', user?.uid, user?.email);

  // Update state when props change (for URL navigation)
  useEffect(() => {
    if (propYear && propYear !== year) {
      console.log('Updating year from prop:', propYear);
      setYear(propYear);
    }
    if (propMonth && (propMonth - 1) !== selectedMonth) {
      console.log('Updating month from prop:', propMonth, 'to selectedMonth:', propMonth - 1);
      setSelectedMonth(propMonth - 1);
    }
  }, [propYear, propMonth, year, selectedMonth]);

  // Generate year options (current year and 5 years back/forward)
  const yearOptions = [];
  for (let i = now.getFullYear() - 5; i <= now.getFullYear() + 5; i++) {
    yearOptions.push(i);
  }

  // Month options
  const monthOptions = [
    { value: 0, label: t('january') || 'January' },
    { value: 1, label: t('february') || 'February' },
    { value: 2, label: t('march') || 'March' },
    { value: 3, label: t('april') || 'April' },
    { value: 4, label: t('may') || 'May' },
    { value: 5, label: t('june') || 'June' },
    { value: 6, label: t('july') || 'July' },
    { value: 7, label: t('august') || 'August' },
    { value: 8, label: t('september') || 'September' },
    { value: 9, label: t('october') || 'October' },
    { value: 10, label: t('november') || 'November' },
    { value: 11, label: t('december') || 'December' },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: theme.palette.background.default,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 2, sm: 4 },
          pb: { xs: 4, sm: 6 },
          px: { xs: 1, sm: 4, md: 6 },
          overflow: "hidden",
        }}
      >
        <Typography 
          variant="h3" 
          fontWeight={700} 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 3,
            color: theme.palette.text.primary,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          {t("dashboard")}
        </Typography>
        
        {/* User Indicator (for debugging) */}
        {user && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              User: {user.email || user.uid.substring(0, 8)}...
            </Typography>
            {isOffline && (
              <Chip 
                icon={<WifiOffIcon />} 
                label="Offline Mode" 
                color="warning" 
                size="small" 
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={() => setShareDialogOpen(true)}
            size="small"
          >
            {t("share")}
          </Button>
        </Box>
        <Typography align="center" color="text.secondary" gutterBottom>
          {t("dashboardWelcome")}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 700, mt: 2, mx: "auto" }}>
          {/* Month/Year Selector */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: 2, 
            mb: 3,
            flexDirection: "row",
            alignItems: "center"
          }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>{t("month") || "Month"}</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => {
                  const newMonth = e.target.value;
                  console.log('Month selector changed:', newMonth, 'API month:', newMonth + 1);
                  console.log('Previous selectedMonth:', selectedMonth);
                  setSelectedMonth(newMonth);
                  // Clear any cached data
                  setDashboardData(null);
                }}
                label={t("month") || "Month"}
              >
                {monthOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t("year") || "Year"}</InputLabel>
              <Select
                value={year}
                onChange={(e) => {
                  const newYear = e.target.value;
                  console.log('Year selector changed:', newYear);
                  console.log('Previous year:', year);
                  setYear(newYear);
                  // Clear any cached data
                  setDashboardData(null);
                }}
                label={t("year") || "Year"}
              >
                {yearOptions.map((yearOption) => (
                  <MenuItem key={yearOption} value={yearOption}>
                    {yearOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <MonthlySpending
            key={`monthly-${year}-${selectedMonth + 1}-${user?.uid || 'no-user'}`} // Force re-render on changes
            year={year}
            month={selectedMonth + 1}
            onDataChange={setDashboardData}
          />
        </Box>

        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          year={year}
          month={selectedMonth + 1}
          data={dashboardData}
        />
      </Box>
      
      <Footer />
    </Box>
  );
}
