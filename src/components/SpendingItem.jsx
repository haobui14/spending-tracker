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
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "../hooks/useTranslation";
import SpendingItemActions from "./SpendingItemActions";

export default function SpendingItem({
  item,
  spendingManager,
  spendings,
  loading,
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const getItemStatus = () => {
    if (item.paid) return { label: t("paid"), color: "success" };
    if ((item.amountPaid || 0) > 0)
      return { label: t("partialPaid"), color: "warning" };
    return { label: t("unpaid"), color: "default" };
  };

  const status = getItemStatus();

  const isEditing = spendingManager.editId === item.id;

  return (
    <ListItem
      sx={{
        opacity: item.paid ? 0.5 : 1,
        borderRadius: 2,
        mb: 1,
        boxShadow: item.paid ? 0 : 1,
        background: item.paid
          ? theme.palette.background.default
          : theme.palette.background.paper,
        border: `2px solid ${
          theme.palette.mode === "dark" ? "#223366" : "#e0eafc"
        }`,
        transition: "background 0.2s",
        "&:hover": {
          background: theme.palette.action.hover,
        },
      }}
    >
      {isEditing ? (
        <>
          <TextField
            value={spendingManager.editName}
            onChange={(e) => spendingManager.setEditName(e.target.value)}
            size="small"
            sx={{ mr: 1, width: 120 }}
            disabled={loading}
            autoFocus
          />
          <TextField
            value={spendingManager.editAmount}
            onChange={(e) => spendingManager.setEditAmount(e.target.value)}
            size="small"
            type="number"
            sx={{ mr: 1, width: 80 }}
            disabled={loading}
          />
          <Button
            onClick={() => spendingManager.handleEditSave(item.id)}
            size="small"
            color="success"
            variant="contained"
            sx={{ mr: 1 }}
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
        </>
      ) : (
        <>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <Chip label={status.label} color={status.color} size="small" />
              </Box>
            }
            secondary={
              <>
                <span style={{ fontWeight: 500 }}>
                  {item.amountPaid ? `$${item.amountPaid.toFixed(2)} / ` : ""}$
                  {item.amount.toFixed(2)}
                </span>
                {item.note && (
                  <Tooltip title={item.note}>
                    <NotesIcon
                      fontSize="small"
                      sx={{ ml: 1, color: "#1976d2" }}
                    />
                  </Tooltip>
                )}
              </>
            }
          />
          <ListItemSecondaryAction>
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
          </ListItemSecondaryAction>
        </>
      )}
    </ListItem>
  );
}
