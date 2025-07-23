import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  useMediaQuery,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchSharedDashboard } from "../utils/firebase";
import Footer from "../components/Footer";
import { useTranslation } from "../hooks/useTranslation";
import { colors } from "../theme";

export default function SharedDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { shareId } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedData, setSharedData] = useState(null);

  // Default categories (same as main app)
  const defaultCategories = [
    { id: 'general', name: t('general'), color: colors.neutral[500] },
    { id: 'housing', name: t('housing'), color: colors.primary.main },
    { id: 'food', name: t('food'), color: colors.financial.paid.main },
    { id: 'transportation', name: t('transportation'), color: colors.financial.partial.main },
    { id: 'utilities', name: t('utilities'), color: colors.financial.unpaid.main },
    { id: 'entertainment', name: t('entertainment'), color: colors.neutral[600] },
    { id: 'healthcare', name: t('healthcare'), color: colors.neutral[700] },
    { id: 'shopping', name: t('shopping'), color: colors.neutral[800] },
  ];

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return defaultCategories.find(cat => cat.id === categoryId) || defaultCategories[0];
  };

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        setLoading(true);
        const data = await fetchSharedDashboard(shareId);
        if (!data) {
          setError("This shared link is invalid or has expired.");
          return;
        }
        setSharedData(data);
      } catch (err) {
        setError("Failed to load shared dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      loadSharedData();
    }
  }, [shareId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "#2563eb",
            mb: 3,
          }}
        />
        <Typography variant="h5" fontWeight={600} color="#475569">
          Loading shared financial report...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          p: 2,
        }}
      >
        <Alert
          severity="error"
          sx={{
            maxWidth: 500,
            borderRadius: 2,
            fontSize: "1rem",
            border: "1px solid #fee2e2",
            backgroundColor: "#fef2f2",
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#dc2626">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!sharedData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          p: 2,
        }}
      >
        <Alert
          severity="warning"
          sx={{
            maxWidth: 500,
            borderRadius: 2,
            fontSize: "1rem",
            border: "1px solid #fef3c7",
            backgroundColor: "#fffbeb",
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#d97706">
            No data found for this shared link.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const { data, year, month, name } = sharedData;
  const spendings = data?.items || [];
  
  // Group spendings by category
  const groupedSpendings = spendings.reduce((groups, spending) => {
    const categoryId = spending.category || 'general';
    if (!groups[categoryId]) {
      groups[categoryId] = [];
    }
    groups[categoryId].push(spending);
    return groups;
  }, {});

  // Determine if any item is partially paid
  const hasPartialPaid = spendings.some(
    (item) => item.amountPaid > 0 && !item.paid
  );
  const monthPaidStatus = hasPartialPaid ? "partial" : data?.status || "unpaid";
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const paid = spendings.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const unpaid = total - paid;

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      default:
        return "error";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Fully Paid";
      case "partial":
        return "Partially Paid";
      default:
        return "Unpaid";
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        m: 0,
        p: 0,
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Professional Header */}
      <Box
        sx={{
          backgroundColor: "white",
          borderBottom: "2px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          py: isMobile ? 3 : 4,
          mb: isMobile ? 3 : 4,
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: isMobile ? 2 : 3 }}>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight={700}
            align="center"
            sx={{
              color: "#1e293b",
              mb: 1,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            {name || "Financial Report"}
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: isMobile ? "1.1rem" : "1.3rem",
              color: "#64748b",
              fontWeight: 500,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            {monthNames[month - 1]} {year} • Expense Summary
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: isMobile ? 2 : 3,
          pb: 4,
        }}
      >
        {/* Financial Summary Cards */}
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 2 : 3}
          sx={{
            mb: isMobile ? 4 : 5,
            width: "100%",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              p: isMobile ? 3 : 4,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              transition: "box-shadow 0.2s ease",
              minWidth: 0, // Allow flex items to shrink
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5">💼</Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="#475569"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                Total Expenses
              </Typography>
            </Box>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              fontWeight="bold"
              color="#1e293b"
              sx={{
                fontFamily: '"Inter", sans-serif',
                wordBreak: "break-word",
              }}
            >
              ${total.toFixed(2)}
            </Typography>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              flex: 1,
              p: isMobile ? 3 : 4,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              transition: "box-shadow 0.2s ease",
              minWidth: 0, // Allow flex items to shrink
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5">✓</Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="#475569"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                Amount Paid
              </Typography>
            </Box>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              fontWeight="bold"
              color="#059669"
              sx={{
                fontFamily: '"Inter", sans-serif',
                wordBreak: "break-word",
              }}
            >
              ${paid.toFixed(2)}
            </Typography>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              flex: 1,
              p: isMobile ? 3 : 4,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              transition: "box-shadow 0.2s ease",
              minWidth: 0, // Allow flex items to shrink
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5">⚠</Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="#475569"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                Outstanding Balance
              </Typography>
            </Box>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              fontWeight="bold"
              color="#dc2626"
              sx={{
                fontFamily: '"Inter", sans-serif',
                wordBreak: "break-word",
              }}
            >
              ${unpaid.toFixed(2)}
            </Typography>
          </Paper>
        </Stack>

        {/* Payment Status */}
        <Box sx={{ mb: isMobile ? 4 : 5, textAlign: "center" }}>
          <Paper
            elevation={1}
            sx={{
              display: "inline-block",
              px: 4,
              py: 2,
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ mb: 0.5, fontWeight: 500 }}
            >
              Payment Status
            </Typography>
            <Chip
              label={getStatusText(monthPaidStatus)}
              color={getStatusColor(monthPaidStatus)}
              size="large"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                height: 40,
                borderRadius: 2,
                fontFamily: '"Inter", sans-serif',
              }}
            />
          </Paper>
        </Box>

        {/* Expense Details Table */}
        <Paper
          elevation={2}
          sx={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              px: isMobile ? 3 : 4,
              py: 3,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={700}
              color="#1e293b"
              sx={{
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Expense Details
            </Typography>
            <Typography
              variant="body1"
              color="#64748b"
              sx={{
                mt: 0.5,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Detailed breakdown of all expenses for this period
            </Typography>
          </Box>
          {spendings.length === 0 ? (
            <Box sx={{ p: isMobile ? 4 : 6, textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Typography variant="h3" color="#94a3b8">
                  📊
                </Typography>
              </Box>
              <Typography
                variant="h6"
                color="#64748b"
                fontWeight={500}
                sx={{ fontFamily: '"Inter", sans-serif' }}
              >
                No expenses recorded for this period
              </Typography>
              <Typography
                variant="body1"
                color="#94a3b8"
                sx={{ mt: 1, fontFamily: '"Inter", sans-serif' }}
              >
                All expense items will appear here when available
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 0 }}>
              {Object.entries(groupedSpendings).map(([categoryId, categoryItems]) => {
                const categoryInfo = getCategoryInfo(categoryId);
                return (
                  <Box key={categoryId} sx={{ mb: 3 }}>
                    {/* Category Header */}
                    <Box
                      sx={{
                        px: isMobile ? 3 : 4,
                        py: 2,
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          color: categoryInfo.color,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {categoryInfo.name}
                      </Typography>
                    </Box>

                    {/* Category Items */}
                    {categoryItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <Box
                          sx={{
                            px: isMobile ? 3 : 4,
                            py: 3,
                            backgroundColor: "white",
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: "#f8fafc",
                            },
                          }}
                        >
                          <Box sx={{ flex: 1, width: "100%" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: isMobile ? "flex-start" : "center",
                                flexDirection: isMobile ? "column" : "row",
                                width: "100%",
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant={isMobile ? "h6" : "h5"}
                                  fontWeight={600}
                                  color="#1e293b"
                                  sx={{
                                    mb: isMobile ? 1 : 0,
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                {item.note && (
                                  <Typography
                                    variant="body2"
                                    color="#64748b"
                                    sx={{
                                      mt: 0.5,
                                      fontFamily: '"Inter", sans-serif',
                                    }}
                                  >
                                    {item.note}
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ textAlign: isMobile ? "left" : "right" }}>
                                <Typography
                                  variant={isMobile ? "h6" : "h5"}
                                  fontWeight="bold"
                                  color="#1e293b"
                                  sx={{ fontFamily: '"Inter", sans-serif' }}
                                >
                                  ${item.amount.toFixed(2)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="#94a3b8"
                                  sx={{ fontFamily: '"Inter", sans-serif' }}
                                >
                                  Amount
                                </Typography>
                              </Box>
                            </Box>

                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              {item.amountPaid > 0 && !item.paid ? (
                                <Chip
                                  label="Partial"
                                  color="warning"
                                  size="small"
                                  sx={{
                                    fontWeight: 500,
                                    backgroundColor: "#fef3c7",
                                    color: "#92400e",
                                    border: "1px solid #fde68a",
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                />
                              ) : item.paid ? (
                                <Chip
                                  label="Paid"
                                  color="success"
                                  size="small"
                                  sx={{
                                    fontWeight: 500,
                                    backgroundColor: "#d1fae5",
                                    color: "#065f46",
                                    border: "1px solid #a7f3d0",
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Unpaid"
                                  sx={{
                                    fontWeight: 500,
                                    backgroundColor: "#fee2e2",
                                    color: "#991b1b",
                                    border: "1px solid #fecaca",
                                    fontFamily: '"Inter", sans-serif',
                                  }}
                                />
                              )}
                              {item.amountPaid > 0 && (
                                <Box
                                  sx={{
                                    px: 2,
                                    py: 0.5,
                                    backgroundColor: "#dbeafe",
                                    color: "#1e40af",
                                    borderRadius: 1,
                                    border: "1px solid #bfdbfe",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{ fontFamily: '"Inter", sans-serif' }}
                                  >
                                    Paid: ${item.amountPaid.toFixed(2)}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                        {index < categoryItems.length - 1 && (
                          <Divider sx={{ borderColor: "#e2e8f0" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
}
