import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  Fade,
  Divider,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMonthlySpending from "../utils/useMonthlySpending";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import appTheme from "../theme";
import Footer from "../components/Footer";

export default function CalendarView() {
  const { t } = useTranslation();
  const theme = useTheme();

  const months = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ];

  const monthsShort = [
    t("janShort"),
    t("febShort"),
    t("marShort"),
    t("aprShort"),
    t("mayShort"),
    t("junShort"),
    t("julShort"),
    t("augShort"),
    t("sepShort"),
    t("octShort"),
    t("novShort"),
    t("decShort"),
  ];

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  const { data: monthData, loading: monthLoading } = useMonthlySpending(
    year,
    selectedMonth + 1
  );
  const navigate = useNavigate();

  // Helper functions
  const getStatusIcon = (status) => {
    const iconProps = { fontSize: 20 };
    switch (status) {
      case "paid":
        return <CheckCircleIcon sx={{ ...iconProps, color: appTheme.colors.financial.paid.main }} />;
      case "partial":
        return <WarningIcon sx={{ ...iconProps, color: appTheme.colors.financial.partial.main }} />;
      case "unpaid":
        return <ErrorIcon sx={{ ...iconProps, color: appTheme.colors.financial.unpaid.main }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: {
        bg: appTheme.colors.financial.paid.background,
        border: appTheme.colors.financial.paid.border,
        text: appTheme.colors.financial.paid.text,
      },
      partial: {
        bg: appTheme.colors.financial.partial.background,
        border: appTheme.colors.financial.partial.border,
        text: appTheme.colors.financial.partial.text,
      },
      unpaid: {
        bg: appTheme.colors.financial.unpaid.background,
        border: appTheme.colors.financial.unpaid.border,
        text: appTheme.colors.financial.unpaid.text,
      },
      default: {
        bg: theme.palette.background.paper,
        border: theme.palette.divider,
        text: theme.palette.text.primary,
      },
    };
    return colors[status] || colors.default;
  };

  const calculateTotals = (items) => {
    if (!items) return { paid: 0, unpaid: 0 };
    const paid = items.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { paid, unpaid: total - paid };
  };

  const handleYearChange = (direction) => {
    setYear((prev) => (direction === "next" ? prev + 1 : prev - 1));
  };

  // Styles
  const scrollbarStyles = {
    maxHeight: { xs: "none", sm: 300 },
    overflowY: { xs: "visible", sm: "auto" },
    "&::-webkit-scrollbar": {
      width: { xs: 0, sm: 8 },
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: { xs: "transparent", sm: "#c1c8d1" },
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: { xs: "transparent", sm: "#a0aec0" },
    },
    scrollbarWidth: { xs: "none", sm: "thin" },
    scrollbarColor: { xs: "auto", sm: "#c1c8d1 transparent" },
  };

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
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 6,
            position: "relative",
          }}
        >
          <Paper
            elevation={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 3 },
              px: { xs: 2, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: { xs: 4, sm: 6 },
              width: "100%",
              maxWidth: "95%",
              background: theme.palette.background.paper,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px 0 rgba(0,0,0,0.3)"
                  : "0 8px 32px 0 rgba(0,0,0,0.1)",
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 28,
                color: theme.palette.mode === "dark" ? "#60a5fa" : appTheme.colors.primary.main,
              }}
            />
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={800}
              sx={{
                color: theme.palette.text.primary,
                letterSpacing: 1,
              }}
            >
              {t("monthlyOverview")}
            </Typography>

            {/* Year Selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => handleYearChange("prev")}
                size="small"
                sx={{
                  color: theme.palette.mode === "dark" ? "#60a5fa" : appTheme.colors.primary.main,
                  "&:hover": { 
                    bgcolor: theme.palette.mode === "dark" 
                      ? "#60a5fa15" 
                      : appTheme.colors.primary.main + "15" 
                  },
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>

              <Chip
                label={year}
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: theme.palette.mode === "dark" ? "#60a5fa" : appTheme.colors.primary.main,
                  borderColor: theme.palette.mode === "dark" ? "#60a5fa" : appTheme.colors.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" 
                      ? "#60a5fa15" 
                      : appTheme.colors.primary.main + "15",
                  },
                }}
              />

              <IconButton
                onClick={() => handleYearChange("next")}
                size="small"
                sx={{
                  color: theme.palette.mode === "dark" ? "#60a5fa" : appTheme.colors.primary.main,
                  "&:hover": { 
                    bgcolor: theme.palette.mode === "dark" 
                      ? "#60a5fa15" 
                      : appTheme.colors.primary.main + "15" 
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mb: 6,
          }}
        >
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {months.map((month, idx) => {
              const isCurrent = year === currentYear && idx === currentMonth;
              const isSelected = idx === selectedMonth;
              const statusColors =
                monthData && isSelected
                  ? getStatusColor(monthData.status)
                  : getStatusColor();

              return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={month}>
                  <Fade in timeout={300 + idx * 50}>
                    <Card
                      elevation={isSelected ? 12 : 4}
                      sx={{
                        cursor: "pointer",
                        borderRadius: 4,
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        zIndex: isSelected ? 2 : 1,
                        background: isCurrent
                          ? theme.palette.mode === "dark" ? "#1e3a8a" : "#e8f5e8"
                          : theme.palette.mode === "dark"
                          ? isSelected
                            ? "#1e40af"
                            : "#1f2937"
                          : isSelected
                          ? statusColors.bg
                          : theme.palette.background.paper,
                        border: `2px solid ${
                          isCurrent
                            ? theme.palette.mode === "dark" ? "#3b82f6" : "#4caf50"
                            : isSelected
                            ? theme.palette.mode === "dark" ? "#60a5fa" : statusColors.border
                            : "transparent"
                        }`,
                        "&:hover": {
                          transform: "scale(1.02) translateY(-2px)",
                          boxShadow: appTheme.shadows.md,
                          zIndex: 3,
                        },
                      }}
                      onClick={() => setSelectedMonth(idx)}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                          textAlign: "center",
                          position: "relative",
                          "&:last-child": { pb: 3 },
                        }}
                      >
                        <Typography
                          variant={isMobile ? "body1" : "h6"}
                          fontWeight={700}
                          sx={{
                            color: isCurrent
                              ? theme.palette.mode === "dark" ? "#dbeafe" : "#2e7d32"
                              : theme.palette.mode === "dark"
                              ? "#f1f5f9"
                              : isSelected
                              ? statusColors.text
                              : theme.palette.text.primary,
                            letterSpacing: 1,
                            mb: 1,
                            fontWeight: isCurrent ? 700 : 700,
                          }}
                        >
                          {isMobile ? monthsShort[idx] : month}
                        </Typography>

                        {isSelected && monthData && (
                          <Box sx={{ mt: 1 }}>
                            {getStatusIcon(monthData.status)}
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.5,
                                color: statusColors.text,
                                fontWeight: 600,
                              }}
                            >
                              {monthData.total
                                ? `$${monthData.total.toFixed(0)}`
                                : "$0"}
                            </Typography>
                          </Box>
                        )}

                        {isCurrent && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background:
                                theme.palette.mode === "dark"
                                  ? "#3b82f6"
                                  : "#4caf50",
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Monthly Details */}
        {selectedMonth !== null && (
          <Fade in timeout={500}>
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              <Paper
                elevation={16}
                sx={{
                  borderRadius: 6,
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 4,
                    background: theme.palette.mode === "dark" 
                      ? "#1e293b" 
                      : appTheme.colors.background.paper,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    position: "relative",
                  }}
                >
                  <Typography variant="h5" fontWeight={700} align="center">
                    {months[selectedMonth]} {year}
                  </Typography>
                  {monthData && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Chip
                        icon={getStatusIcon(monthData.status)}
                        label={
                          monthData.status ? t(monthData.status) : t("noData")
                        }
                        sx={{
                          bgcolor: theme.palette.mode === "dark" 
                            ? "#334155" 
                            : appTheme.colors.background.elevated,
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 2, sm: 4 } }}>
                  {monthLoading ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography>{t("loading")}</Typography>
                    </Box>
                  ) : monthData ? (
                    <>
                      {/* Summary Cards */}
                      <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ 
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : theme.palette.background.paper 
                          }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <TrendingUpIcon 
                                sx={{ 
                                  mb: 1,
                                  color: theme.palette.mode === "dark" 
                                    ? "#60a5fa" 
                                    : theme.palette.primary.main 
                                }} 
                              />
                              <Typography variant="h6" fontWeight={700}>
                                {monthData.items?.length || 0}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("totalItems")}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ 
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : theme.palette.background.paper 
                          }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <AccountBalanceWalletIcon
                                sx={{ 
                                  mb: 1,
                                  color: theme.palette.mode === "dark" 
                                    ? "#60a5fa" 
                                    : theme.palette.primary.main 
                                }}
                              />
                              <Typography variant="h6" fontWeight={700}>
                                {`$${monthData.total?.toFixed(2) || "0.00"}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("total")}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ 
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : theme.palette.background.paper 
                          }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <CheckCircleIcon
                                sx={{ 
                                  color: theme.palette.mode === "dark" 
                                    ? "#10b981" 
                                    : appTheme.colors.financial.paid.main, 
                                  mb: 1 
                                }}
                              />
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  color: theme.palette.mode === "dark" 
                                    ? "#10b981" 
                                    : appTheme.colors.financial.paid.text
                                }}
                              >
                                {`$${calculateTotals(monthData.items).paid.toFixed(2)}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("paid")}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <Card elevation={4} sx={{ 
                            borderRadius: 3,
                            bgcolor: theme.palette.mode === "dark" ? "#1e293b" : theme.palette.background.paper 
                          }}>
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <ErrorIcon sx={{ 
                                color: theme.palette.mode === "dark" 
                                  ? "#ef4444" 
                                  : appTheme.colors.financial.unpaid.main, 
                                mb: 1 
                              }} />
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  color: theme.palette.mode === "dark" 
                                    ? "#ef4444" 
                                    : appTheme.colors.financial.unpaid.text
                                }}
                              >
                                {`$${calculateTotals(monthData.items).unpaid.toFixed(2)}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("unpaid")}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      {/* Items List */}
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 2 }}
                        >
                          {t("itemsDetail")}
                        </Typography>
                        <Box sx={scrollbarStyles}>
                          {monthData.items && monthData.items.length > 0 ? (
                            monthData.items.map((item, i) => (
                              <Card
                                key={i}
                                elevation={2}
                                sx={{
                                  mb: 1.5,
                                  borderRadius: 2,
                                  bgcolor: theme.palette.mode === "dark" ? "#1e293b" : theme.palette.background.paper,
                                  border: `1px solid ${
                                    item.paid 
                                      ? theme.palette.mode === "dark" ? "#10b981" : appTheme.colors.financial.paid.border
                                      : theme.palette.mode === "dark" ? "#ef4444" : appTheme.colors.financial.unpaid.border
                                  }`,
                                }}
                              >
                                <CardContent
                                  sx={{
                                    py: 2,
                                    px: 3,
                                    "&:last-child": { pb: 2 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                      >
                                        {item.name}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          color: theme.palette.mode === "dark" 
                                            ? "#60a5fa" 
                                            : theme.palette.primary.main,
                                          fontWeight: 700
                                        }}
                                      >
                                        {`$${item.amount.toFixed(2)}`}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      size="small"
                                      label={t(item.paid ? "paid" : "unpaid")}
                                      sx={
                                        theme.palette.mode === "dark" 
                                          ? {
                                              backgroundColor: item.paid ? "#065f46" : "#7f1d1d",
                                              color: item.paid ? "#10b981" : "#ef4444",
                                              fontWeight: 600,
                                              border: `1px solid ${item.paid ? "#10b981" : "#ef4444"}`,
                                            }
                                          : item.paid 
                                            ? appTheme.components.chip.paid
                                            : appTheme.components.chip.unpaid
                                      }
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Typography
                              color="text.secondary"
                              align="center"
                              sx={{ py: 4 }}
                            >
                              {t("noSpendingsForMonth")}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() =>
                            navigate(`/dashboard/${year}/${selectedMonth + 1}`)
                          }
                          startIcon={<CalendarTodayIcon />}
                          sx={{
                            fontWeight: 700,
                            fontSize: 16,
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            backgroundColor: theme.palette.mode === "dark" 
                              ? "#1e40af" 
                              : appTheme.colors.primary.main,
                            color: "#ffffff",
                            boxShadow: appTheme.shadows.md,
                            "&:hover": {
                              backgroundColor: theme.palette.mode === "dark" 
                                ? "#1d4ed8" 
                                : appTheme.colors.primary.dark,
                              boxShadow: appTheme.shadows.lg,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          {t("viewInDashboard")}
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      align="center"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      {t("noDataAvailable")}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}
      </Box>
      
      <Footer />
    </Box>
  );
}
