import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Button,
  Box,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "../hooks/useTranslation";
import SpendingItemActions from "./SpendingItemActions";
import appTheme from "../theme";

export default function SpendingItem({
  item,
  spendingManager,
  spendings,
  loading,
  defaultCategories = [],
  compact = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const getItemStatus = () => {
    if (item.paid) return { 
      label: t("paid"), 
      styles: appTheme.components.chip.paid 
    };
    if ((item.amountPaid || 0) > 0)
      return { 
        label: t("partial"), 
        styles: appTheme.components.chip.partial 
      };
    return { 
      label: t("unpaid"), 
      styles: appTheme.components.chip.unpaid 
    };
  };

  const status = getItemStatus();

  const isEditing = spendingManager.editId === item.id;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: compact ? 0 : 1,
        border: compact ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
        backgroundColor: item.paid 
          ? (theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc')
          : theme.palette.background.paper,
        opacity: item.paid ? 0.7 : 1,
        borderRadius: compact ? 0 : 2,
        '&:hover': { 
          boxShadow: compact ? 0 : 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
        },
        transition: 'all 0.2s ease',
        borderLeft: compact ? 'none' : undefined,
        borderRight: compact ? 'none' : undefined,
        borderTop: compact ? (item === 0 ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`) : undefined,
        borderBottom: compact ? 'none' : undefined,
      }}
    >
      {isEditing ? (
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <TextField
                value={spendingManager.editName}
                onChange={(e) => spendingManager.setEditName(e.target.value)}
                size="small"
                label="Name"
                sx={{ minWidth: 120, flexGrow: 1 }}
                disabled={loading}
                autoFocus
              />
              <FormControl size="small" sx={{ minWidth: 120 }} disabled={loading}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={spendingManager.editCategory || item.category || 'general'}
                  onChange={(e) => spendingManager.setEditCategory(e.target.value)}
                  label="Category"
                >
                  {defaultCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
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
                value={spendingManager.editAmount}
                onChange={(e) => spendingManager.setEditAmount(e.target.value)}
                size="small"
                type="number"
                label="Amount"
                sx={{ minWidth: 80 }}
                disabled={loading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => spendingManager.handleEditSave(item.id)}
                size="small"
                variant="contained"
                sx={{ 
                  backgroundColor: appTheme.colors.primary.main,
                  '&:hover': {
                    backgroundColor: appTheme.colors.primary.dark,
                  },
                }}
                disabled={loading}
              >
                {t("save")}
              </Button>
              <Button
                onClick={spendingManager.handleCancelEdit}
                size="small"
                color="inherit"
                variant="outlined"
                disabled={loading}
              >
                {t("cancel")}
              </Button>
            </Box>
          </Box>
        </CardContent>
      ) : (
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" fontWeight={600} color={theme.palette.text.primary}>
              {item.name}
            </Typography>
            <Typography variant="body1" fontWeight={600} color={theme.palette.text.primary}>
              {item.amountPaid ? `$${item.amountPaid.toFixed(2)} / ` : ""}$
              {item.amount.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
            {item.note && (
              <Tooltip title={item.note}>
                <NotesIcon
                  fontSize="small"
                  sx={{ color: appTheme.colors.calendar.current }}
                />
              </Tooltip>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={status.label} 
              size="small" 
              sx={{
                ...status.styles,
                fontWeight: 500,
              }}
            />
            
            <SpendingItemActions
              item={item}
              loading={loading}
              onMarkPaid={(undo) =>
                spendingManager.handleMarkPaid(item.id, undo, spendings)
              }
              onEdit={() => spendingManager.handleEdit(item)}
              onDelete={() => spendingManager.handleDelete(item.id)}
              onOpenPartialDialog={() =>
                spendingManager.handleOpenItemPartialDialog(item)
              }
              onOpenNoteDialog={() =>
                spendingManager.handleOpenNoteDialog(item)
              }
            />
          </Box>
        </CardContent>
      )}
    </Card>
  );
}
