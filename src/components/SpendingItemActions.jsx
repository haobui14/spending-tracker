import React from "react";
import {
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UndoIcon from "@mui/icons-material/Undo";
import PaymentsIcon from "@mui/icons-material/Payments";
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

  const actionButtonStyle = {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* Payment Actions Group */}
      {item.paid ? (
        <Tooltip title={t('undoPaidStatus')}>
          <IconButton
            edge="end"
            aria-label={t('undoPaidStatus')}
            onClick={() => onMarkPaid(true)}
            disabled={loading}
            sx={{
              ...actionButtonStyle,
              color: '#6b7280',
              '&:hover': {
                ...actionButtonStyle['&:hover'],
                backgroundColor: '#f3f4f6',
                color: '#374151',
              },
            }}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title={t('markAsPaid')}>
            <IconButton
              edge="end"
              aria-label={t('markAsPaid')}
              onClick={() => onMarkPaid(false)}
              disabled={loading}
              sx={{
                ...actionButtonStyle,
                color: '#059669',
                '&:hover': {
                  ...actionButtonStyle['&:hover'],
                  backgroundColor: '#d1fae5',
                  color: '#047857',
                },
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('partialPaid')}>
            <IconButton
              edge="end"
              aria-label={t('partialPaid')}
              onClick={() => onOpenPartialDialog(item)}
              disabled={loading}
              sx={{
                ...actionButtonStyle,
                color: '#d97706',
                '&:hover': {
                  ...actionButtonStyle['&:hover'],
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                },
              }}
            >
              <PaymentsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('edit')}>
            <IconButton
              edge="end"
              aria-label={t('edit')}
              onClick={() => onEdit(item)}
              disabled={loading}
              sx={{
                ...actionButtonStyle,
                color: '#6366f1',
                '&:hover': {
                  ...actionButtonStyle['&:hover'],
                  backgroundColor: '#e0e7ff',
                  color: '#4f46e5',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Tooltip title={item.note ? t('editViewNote') : t('addNote')}>
        <IconButton
          edge="end"
          aria-label={item.note ? t('editViewNote') : t('addNote')}
          onClick={() => onOpenNoteDialog(item)}
          disabled={loading}
          sx={{
            ...actionButtonStyle,
            color: item.note ? '#2563eb' : '#6b7280',
            '&:hover': {
              ...actionButtonStyle['&:hover'],
              backgroundColor: item.note ? '#dbeafe' : '#f3f4f6',
              color: item.note ? '#1d4ed8' : '#374151',
            },
          }}
        >
          <NoteAddIcon />
        </IconButton>
      </Tooltip>
        
      <Tooltip title={t('delete')}>
        <IconButton
          edge="end"
          aria-label={t('delete')}
          onClick={() => onDelete(item.id)}
          disabled={loading}
          sx={{
            ...actionButtonStyle,
            color: '#dc2626',
            '&:hover': {
              ...actionButtonStyle['&:hover'],
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
