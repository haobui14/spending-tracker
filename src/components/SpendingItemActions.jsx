import React from "react";
import {
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UndoIcon from "@mui/icons-material/Undo";
import { useTranslation } from "../hooks/useTranslation";

export default function SpendingItemActions({
  item,
  loading,
  onMarkPaid,
  onEdit,
  onDelete,
  onOpenPartialDialog,
  onOpenNoteDialog,
}) {
  const { t } = useTranslation();

  return (
    <>
      {item.paid && (
        <Tooltip title={t('undoPaidStatus')}>
          <IconButton
            edge="end"
            color="default"
            aria-label={t('undoPaidStatus')}
            onClick={() => onMarkPaid(true)}
            disabled={loading}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
      )}
      
      <Tooltip title={item.note ? t('editViewNote') : t('addNote')}>
        <IconButton
          edge="end"
          color="info"
          aria-label={item.note ? t('editViewNote') : t('addNote')}
          onClick={() => onOpenNoteDialog(item)}
          disabled={loading}
        >
          <NoteAddIcon />
        </IconButton>
      </Tooltip>

      {!item.paid && (
        <>
          <Tooltip title={t('markAsPaid')}>
            <IconButton
              edge="end"
              color="success"
              aria-label={t('markAsPaid')}
              onClick={() => onMarkPaid(false)}
              disabled={loading}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('partialPaid')}>
            <IconButton
              edge="end"
              color="warning"
              aria-label={t('partialPaid')}
              onClick={() => onOpenPartialDialog(item)}
              disabled={loading}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('edit')}>
            <IconButton
              edge="end"
              color="primary"
              aria-label={t('edit')}
              onClick={() => onEdit(item)}
              disabled={loading}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
      
      <Tooltip title={t('delete')}>
        <IconButton
          edge="end"
          color="error"
          aria-label={t('delete')}
          onClick={() => onDelete(item.id)}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
