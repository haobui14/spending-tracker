import React, { useState, useEffect } from "react";
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
  Paper,
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMonthlySpending from "../utils/useMonthlySpending";
import useSpendingManager from '../hooks/useSpendingManager';
import SpendingItem from "./SpendingItem";
import SpendingDialogs from "./SpendingDialogs";

export default function MonthlySpending({ year, month, onDataChange }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const { data, saveData, updateData, loading, error } = useMonthlySpending(year, month);
  
  // Tabs state
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem("spendingTabs");
    if (saved) return JSON.parse(saved);
    return [{ id: 0, label: t('main'), key: "main" }];
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [tabSpendings, setTabSpendings] = useState(() => {
    const saved = localStorage.getItem("spendingTabSpendings");
    if (saved) return JSON.parse(saved);
    return {};
  });
  
  // Tab management state
  const [renamingTabIdx, setRenamingTabIdx] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTabIdx, setDeleteTabIdx] = useState(null);

  // Sync main tab with backend data
  useEffect(() => {
    if (data) {
      setTabSpendings((prev) => {
        const updated = { ...prev, main: data };
        localStorage.setItem("spendingTabSpendings", JSON.stringify(updated));
        return updated;
      });
    }
  }, [data]);

  // Sync tabs and tabSpendings to localStorage
  useEffect(() => {
    localStorage.setItem("spendingTabs", JSON.stringify(tabs));
  }, [tabs]);
  
  useEffect(() => {
    localStorage.setItem("spendingTabSpendings", JSON.stringify(tabSpendings));
  }, [tabSpendings]);

  // Computed values
  const currentTabKey = tabs[activeTab]?.key || "main";
  const spendings = tabSpendings[currentTabKey]?.items || [];
  const hasPartialPaid = spendings.some(item => item.amountPaid > 0 && !item.paid);
  
  let monthPaidStatus = "unpaid";
  if (hasPartialPaid) monthPaidStatus = "partial";
  else if (spendings.length > 0 && spendings.every(item => item.paid)) monthPaidStatus = "paid";
  
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const paid = spendings.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const unpaid = total - paid;

  // Use the spending manager hook (after computed values)
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
    spendingManager.handlePartialPaid();
  };

  const handleSaveNote = () => {
    spendingManager.handleSaveNote();
  };

  // Tab UI
  return (
    <Paper
      elevation={6}
      sx={{
        p: isMobile ? 2 : 4,
        mt: 4,
        borderRadius: 4,
        boxShadow: 8,
        maxWidth: 700,
        mx: "auto",
        my: 4,
        background: theme.palette.background.paper,
        position: "relative",
        border: `2.5px solid ${
          theme.palette.mode === "dark" ? "#223366" : "#e0eafc"
        }`,
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          {t('monthlySpending')}
        </Typography>
        <Chip
          label={
            monthPaidStatus === "paid"
              ? t('paid')
              : monthPaidStatus === "partial"
              ? t('partialPaid')
              : t('unpaid')
          }
          color={
            monthPaidStatus === "paid"
              ? "success"
              : monthPaidStatus === "partial"
              ? "warning"
              : "error"
          }
          sx={{ fontWeight: 700, fontSize: 16 }}
        />
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
        onSubmit={(e) => spendingManager.handleAddSpending(e, spendings)}
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
          color="success"
          sx={{ minWidth: 100, fontWeight: 700, fontSize: 16 }}
          disabled={loading}
        >
          {t('add')}
        </Button>
      </Box>
      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMarkMonthFullyPaid}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ fontWeight: 700 }}
        >
          {t('markAsFullyPaid')}
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleOpenPartialDialog}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ fontWeight: 700 }}
        >
          {t('markPartialPaidAll')}
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <List>
        {spendings.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography color="text.secondary">
                  {t('noSpendingsYet')}
                </Typography>
              }
            />
          </ListItem>
        ) : (
          spendings.map((s) => (
            <SpendingItem
              key={s.id}
              item={s}
              spendingManager={spendingManager}
              spendings={spendings}
              loading={loading}
            />
          ))
        )}
      </List>
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
          color="primary"
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
        />
        <Chip
          label={t('paidAmount', { amount: paid.toFixed(2) })}
          color="success"
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
        />
        <Chip
          label={t('unpaidAmount', { amount: unpaid.toFixed(2) })}
          color="warning"
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
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
    </Paper>
  );
}
