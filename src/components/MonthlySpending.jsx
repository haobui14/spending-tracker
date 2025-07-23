import React, { useState, useEffect, useMemo, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "../hooks/useTranslation";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Stack,
  useMediaQuery,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMonthlySpending from "../utils/useMonthlySpending";
import useSpendingManager from '../hooks/useSpendingManager';
import appTheme, { colors } from "../theme";
import SpendingItem from "./SpendingItem";
import SpendingDialogs from "./SpendingDialogs";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';

export default function MonthlySpending({ year, month, onDataChange }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [user] = useAuthState(auth);
  
  const { data, saveData, updateData, loading, error } = useMonthlySpending(year, month);
  
  // Helper function to get user-specific localStorage keys
  const getUserStorageKey = useCallback((key) => {
    return user ? `${key}_${user.uid}` : key;
  }, [user]);
  
  // Default categories
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
  
  // View mode state
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem(getUserStorageKey("spendingViewMode"));
    return saved || "list";
  });
  
  // Category state for new spending item
  const [selectedCategory, setSelectedCategory] = useState('general');
  
  // Tabs state - reset when year/month changes
  const [tabs, setTabs] = useState([{ id: 0, label: 'Main', key: "main" }]);
  
  const [activeTab, setActiveTab] = useState(0);
  const [tabSpendings, setTabSpendings] = useState({});
  
  // Tab management state
  const [renamingTabIdx, setRenamingTabIdx] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTabIdx, setDeleteTabIdx] = useState(null);
  
  // Save view mode preference
  useEffect(() => {
    localStorage.setItem(getUserStorageKey("spendingViewMode"), viewMode);
  }, [viewMode, getUserStorageKey]);

  // Clear localStorage cache when year/month changes
  useEffect(() => {
    console.log('MonthlySpending - year/month changed, clearing cache');
    // For month/year changes, we want to load fresh data but keep offline cache
    // Only clear the current session's tab data, not the persistent offline cache
    const currentSessionKey = getUserStorageKey(`session_${year}_${month}`);
    localStorage.removeItem(currentSessionKey);
    
    // Reset to default state for new month/year (use static label to avoid language dependency)
    setTabs([{ id: 0, label: 'Main', key: "main" }]);
    setTabSpendings({});
    setActiveTab(0);
  }, [year, month, getUserStorageKey]);

  // Update main tab label when language changes (without resetting data)
  useEffect(() => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.key === 'main' 
          ? { ...tab, label: t('main') }
          : tab
      )
    );
  }, [t]);

  // Load from offline cache when starting up
  useEffect(() => {
    const offlineCacheKey = getUserStorageKey(`offline_${year}_${month}`);
    const cachedData = localStorage.getItem(offlineCacheKey);
    
    if (cachedData && !data) {
      console.log('Loading from offline cache for', year, month);
      try {
        const parsedData = JSON.parse(cachedData);
        setTabSpendings({ main: parsedData });
      } catch (e) {
        console.error('Error parsing offline cache:', e);
      }
    }
  }, [year, month, getUserStorageKey, data]);

  // Sync main tab with backend data and update offline cache
  useEffect(() => {
    console.log('MonthlySpending - data changed:', data);
    if (data) {
      // Update current session data
      setTabSpendings((prev) => {
        const updated = { ...prev, main: data };
        const sessionKey = getUserStorageKey(`session_${year}_${month}`);
        localStorage.setItem(sessionKey, JSON.stringify(updated));
        return updated;
      });
      
      // Update offline cache for this specific month/year
      const offlineCacheKey = getUserStorageKey(`offline_${year}_${month}`);
      localStorage.setItem(offlineCacheKey, JSON.stringify(data));
      console.log('Cached data for offline use:', offlineCacheKey);
    }
  }, [data, year, month, getUserStorageKey]);

  // Sync tabs and tabSpendings to localStorage
  useEffect(() => {
    localStorage.setItem(getUserStorageKey("spendingTabs"), JSON.stringify(tabs));
  }, [tabs, getUserStorageKey]);
  
  useEffect(() => {
    localStorage.setItem(getUserStorageKey("spendingTabSpendings"), JSON.stringify(tabSpendings));
  }, [tabSpendings, getUserStorageKey]);

  // Computed values
  const currentTabKey = tabs[activeTab]?.key || "main";
  const spendings = useMemo(() => {
    return tabSpendings[currentTabKey]?.items || [];
  }, [tabSpendings, currentTabKey]);
  
  const hasPartialPaid = spendings.some(item => item.amountPaid > 0 && !item.paid);
  
  let monthPaidStatus = "unpaid";
  if (hasPartialPaid) monthPaidStatus = "partial";
  else if (spendings.length > 0 && spendings.every(item => item.paid)) monthPaidStatus = "paid";
  
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const paid = spendings.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const unpaid = total - paid;

  // Group spendings by category
  const groupedSpendings = useMemo(() => {
    const groups = {};
    spendings.forEach(spending => {
      const categoryId = spending.category || 'general';
      if (!groups[categoryId]) {
        groups[categoryId] = [];
      }
      groups[categoryId].push(spending);
    });
    return groups;
  }, [spendings]);

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return defaultCategories.find(cat => cat.id === categoryId) || defaultCategories[0];
  };  // Use the spending manager hook (after computed values)
  const spendingManager = useSpendingManager(
    data, 
    saveData, 
    updateData, 
    currentTabKey, 
    setTabSpendings
  );

  // Notify parent component when data changes (main tab only)
  useEffect(() => {
    if (onDataChange && tabSpendings.main) {
      onDataChange(tabSpendings.main);
    }
  }, [tabSpendings.main, onDataChange]);

  const handleMarkMonthFullyPaid = () => {
    const updatedItems = spendings.map((s) => ({
      ...s,
      paid: true,
      amountPaid: s.amount,
    }));
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);
    const newPaid = newTotal;
    
    if (currentTabKey === "main") {
      saveData({
        ...data,
        items: updatedItems,
        total: newTotal,
        paid: newPaid,
        status: "paid",
        updatedAt: new Date(),
      });
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: updatedItems,
          total: newTotal,
          paid: newPaid,
          status: "paid",
          updatedAt: new Date(),
        },
      }));
    }
  };

  const handleOpenPartialDialog = () => {
    spendingManager.setPartialDialogOpen(true);
    spendingManager.setPartialAmount("");
    spendingManager.setPartialError("");
  };

  // Batch update for partial paid (applies partial across all items, not per item)
  const handlePartialPaid = () => {
    spendingManager.handlePartialPaid(spendings);
  };

  const handleSaveNote = () => {
    spendingManager.handleSaveNote();
  };

  // Tab UI
  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        mt: 2,
        borderRadius: 4,
        maxWidth: 700,
        mx: "auto",
        my: 2,
        background: theme.palette.background.paper,
        position: "relative",
        border: theme.palette.mode === 'dark' ? `1px solid #374151` : `1px solid ${appTheme.colors.border.light}`,
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : 2,
      }}
    >
      {/* Tabs for multiple spending categories */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flexGrow: 1,
            "& .MuiTab-root": {
              border: "none !important",
              minHeight: 48,
              outline: "none",
            },
            "& .Mui-selected": {
              border: "none !important",
              minHeight: 48,
              outline: "none",
            },
            "& .MuiTab-root.Mui-focusVisible": {
              outline: "none !important",
              boxShadow: "none !important",
            },
            "& .MuiTabs-indicator": {
              left: 0,
              right: 0,
              borderLeft: "none",
              borderRight: "none",
            },
          }}
        >
          {tabs.map((tab, idx) => {
            let labelContent;
            if (renamingTabIdx === idx) {
              labelContent = (
                <TextField
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => {
                    if (renameValue.trim()) {
                      setTabs((prev) =>
                        prev.map((t, i) =>
                          i === idx ? { ...t, label: renameValue.trim() } : t
                        )
                      );
                    }
                    setRenamingTabIdx(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && renameValue.trim()) {
                      setTabs((prev) =>
                        prev.map((t, i) =>
                          i === idx ? { ...t, label: renameValue.trim() } : t
                        )
                      );
                      setRenamingTabIdx(null);
                    } else if (e.key === "Escape") {
                      setRenamingTabIdx(null);
                    }
                  }}
                  size="small"
                  autoFocus
                  sx={{ minWidth: 80, maxWidth: 120, mx: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
              );
            } else {
              labelContent = (
                <span
                  style={{
                    fontWeight: activeTab === idx ? 700 : 400,
                    cursor: tab.key !== "main" ? "pointer" : "default",
                  }}
                  onDoubleClick={() => {
                    if (tab.key !== "main") {
                      setRenamingTabIdx(idx);
                      setRenameValue(tab.label);
                    }
                  }}
                >
                  {tab.label}
                </span>
              );
            }
            return <Tab key={tab.key} label={labelContent} />;
          })}
        </Tabs>
        <IconButton
          aria-label={t('addSpendingTab')}
          onClick={() => {
            const newId = tabs.length;
            const newKey = `tab${newId}`;
            setTabs((prev) => [
              ...prev,
              { id: newId, label: `${t('tab')} ${newId + 1}`, key: newKey },
            ]);
            setTabSpendings((prev) => ({ ...prev, [newKey]: { items: [] } }));
            setActiveTab(tabs.length);
          }}
          sx={{ ml: 2 }}
        >
          <AddIcon />
        </IconButton>
        {/* Delete Tab Confirmation Modal */}
        <Dialog
          open={deleteTabIdx !== null}
          onClose={() => setDeleteTabIdx(null)}
        >
          <DialogTitle>{t('deleteTab')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('deleteTabConfirmation')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTabIdx(null)}>{t('cancel')}</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                if (deleteTabIdx === null) return;
                const delKey = tabs[deleteTabIdx].key;
                setTabs((prev) => prev.filter((_, i) => i !== deleteTabIdx));
                setTabSpendings((prev) => {
                  const copy = { ...prev };
                  delete copy[delKey];
                  return copy;
                });
                // If deleting current tab, go to previous or main
                setActiveTab((prev) =>
                  prev === deleteTabIdx
                    ? Math.max(0, prev - 1)
                    : prev > deleteTabIdx
                    ? prev - 1
                    : prev
                );
                setDeleteTabIdx(null);
              }}
            >
              {t('delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.5)",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || t('errorOccurred')}
        </Alert>
      )}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('list')}
            sx={{ 
              minWidth: 80,
              backgroundColor: viewMode === 'list' ? '#1e40af' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : '#60a5fa',
              borderColor: '#60a5fa',
              '&:hover': {
                backgroundColor: viewMode === 'list' ? '#1e3a8a' : '#60a5fa15',
                borderColor: '#60a5fa',
              },
            }}
          >
            {t('list')}
          </Button>
          <Button
            variant={viewMode === 'category' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('category')}
            sx={{ 
              minWidth: 80,
              backgroundColor: viewMode === 'category' ? '#1e40af' : 'transparent',
              color: viewMode === 'category' ? '#ffffff' : '#60a5fa',
              borderColor: '#60a5fa',
              '&:hover': {
                backgroundColor: viewMode === 'category' ? '#1e3a8a' : '#60a5fa15',
                borderColor: '#60a5fa',
              },
            }}
          >
            {t('category')}
          </Button>
          <Chip
            label={
              monthPaidStatus === "paid"
                ? t('paid')
                : monthPaidStatus === "partial"
                ? t('partial')
                : t('unpaid')
            }
            sx={{
              fontWeight: 700,
              fontSize: 16,
              ...(monthPaidStatus === "paid" 
                ? appTheme.components.chip.paid
                : monthPaidStatus === "partial"
                ? appTheme.components.chip.partial
                : appTheme.components.chip.unpaid
              ),
            }}
          />
        </Box>
        {/* Remove tab button for non-main active tab */}
        {tabs[activeTab]?.key !== "main" && (
          <IconButton
            size="small"
            aria-label="Delete Tab"
            onClick={() => setDeleteTabIdx(activeTab)}
            sx={{ ml: 2 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          const newSpending = {
            id: Date.now(),
            name: spendingManager.name,
            amount: parseFloat(spendingManager.amount),
            category: selectedCategory,
            paid: false,
            amountPaid: 0
          };
          spendingManager.handleAddSpending(e, spendings, newSpending);
          setSelectedCategory('general');
        }}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label={t('spendingName')}
          value={spendingManager.name}
          onChange={(e) => spendingManager.setName(e.target.value)}
          required
          fullWidth={isMobile}
          disabled={loading}
        />
        <FormControl sx={{ minWidth: 150 }} disabled={loading}>
          <InputLabel>{t('category')}</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label={t('category')}
          >
            {defaultCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: category.color,
                    }}
                  />
                  {category.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={t('amount')}
          value={spendingManager.amount}
          onChange={(e) => spendingManager.setAmount(e.target.value)}
          required
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth={isMobile}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ 
            minWidth: 100, 
            fontWeight: 700, 
            fontSize: 16,
            backgroundColor: '#1e40af',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1e3a8a',
            },
          }}
          disabled={loading}
        >
          {t('add')}
        </Button>
      </Box>
      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleMarkMonthFullyPaid}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ 
            fontWeight: 700,
            backgroundColor: '#16a34a',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#15803d',
            },
          }}
        >
          {t('markAsFullyPaid')}
        </Button>
        <Button
          variant="outlined"
          onClick={handleOpenPartialDialog}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ 
            fontWeight: 700,
            borderColor: '#f59e0b',
            color: '#f59e0b',
            '&:hover': {
              backgroundColor: '#f59e0b15',
              borderColor: '#f59e0b',
            },
          }}
        >
          {t('markPartialPaidAll')}
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      
      {/* Spending List */}
      {viewMode === 'list' ? (
        <Box>
          {spendings.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {t('noSpendingsYet')}
              </Typography>
            </Box>
          ) : (
            spendings.map((s) => (
              <SpendingItem
                key={s.id}
                item={s}
                spendingManager={spendingManager}
                spendings={spendings}
                loading={loading}
                showCategory={true}
                getCategoryInfo={getCategoryInfo}
                defaultCategories={defaultCategories}
              />
            ))
          )}
        </Box>
      ) : (
        // Category View
        <Box>
          {spendings.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {t('noSpendingsYet')}
            </Typography>
          ) : (
            Object.entries(groupedSpendings).map(([categoryId, categoryItems]) => {
              const categoryInfo = getCategoryInfo(categoryId);
              const categoryTotal = categoryItems.reduce((sum, item) => sum + (item.amount || 0), 0);
              const categoryPaid = categoryItems.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
              
              return (
                <Card key={categoryId} sx={{ 
                  mb: 3, 
                  border: theme.palette.mode === 'dark' ? `1px solid #374151` : `1px solid ${colors.neutral[200]}`,
                  backgroundColor: theme.palette.background.paper,
                }}>
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: theme.palette.mode === 'dark' ? `1px solid #374151` : `1px solid ${colors.neutral[200]}`, 
                    bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : colors.neutral[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: categoryInfo.color,
                        }}
                      />
                      <Typography variant="h6" fontWeight={600} color={theme.palette.text.primary}>
                        {categoryInfo.name}
                      </Typography>
                      <Chip
                        label={`${categoryItems.length} ${categoryItems.length === 1 ? t('item') : t('items')}`}
                        size="small"
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? '#374151' : colors.neutral[200],
                          color: theme.palette.text.primary,
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        ${categoryPaid.toFixed(2)} / ${categoryTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 0 }}>
                    {categoryItems.map((item, itemIndex) => (
                      <Box
                        key={item.id}
                        sx={{
                          borderTop: itemIndex === 0 ? 'none' : theme.palette.mode === 'dark' ? `1px solid #374151` : `1px solid ${colors.neutral[200]}`,
                          '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : colors.neutral[50] },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <SpendingItem
                          item={item}
                          spendingManager={spendingManager}
                          spendings={spendings}
                          loading={loading}
                          showCategory={false}
                          getCategoryInfo={getCategoryInfo}
                          defaultCategories={defaultCategories}
                          compact={true}
                        />
                      </Box>
                    ))}
                  </Box>
                </Card>
              );
            })
          )}
        </Box>
      )}
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          mt: 2,
          gap: isMobile ? 2 : 0,
        }}
      >
        <Chip
          label={t('totalAmount', { amount: total.toFixed(2) })}
          sx={{ 
            fontWeight: 600, 
            fontSize: 16, 
            minWidth: 120,
            backgroundColor: '#1e40af',
            color: '#ffffff',
          }}
        />
        <Chip
          label={t('paidAmount', { amount: paid.toFixed(2) })}
          sx={{ 
            fontWeight: 600, 
            fontSize: 16, 
            minWidth: 120,
            backgroundColor: '#16a34a',
            color: '#ffffff',
          }}
        />
        <Chip
          label={t('unpaidAmount', { amount: unpaid.toFixed(2) })}
          sx={{ 
            fontWeight: 600, 
            fontSize: 16, 
            minWidth: 120,
            backgroundColor: '#dc2626',
            color: '#ffffff',
          }}
        />
      </Box>
      <SpendingDialogs
        spendingManager={spendingManager}
        spendings={spendings}
        handlePartialPaid={handlePartialPaid}
        handleSaveNote={handleSaveNote}
        t={t}
        loading={loading}
        unpaid={unpaid}
      />
    </Box>
  );
}
