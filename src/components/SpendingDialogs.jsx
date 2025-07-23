import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "../hooks/useTranslation";

export function PartialPaymentDialog({
  open,
  onClose,
  amount,
  onAmountChange,
  error,
  onConfirm,
  loading,
  maxAmount,
  title,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('partialPaidAmount')}
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          fullWidth
          inputProps={{ min: 0, max: maxAmount, step: 0.01 }}
          sx={{ mt: 1 }}
          disabled={loading}
          autoFocus
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="warning"
          disabled={loading}
        >
          {t('markPartialPaid')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function NoteDialog({
  open,
  onClose,
  noteText,
  onNoteChange,
  onSave,
  loading,
  itemName,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {itemName} - {t('note')}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={t('note')}
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          sx={{ mt: 1 }}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('cancel')}
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="info"
          disabled={loading}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function TabDeleteDialog({
  open,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('deleteTab')}</DialogTitle>
      <DialogContent>
        <Typography>
          {t('deleteTabConfirmation')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
        >
          {t('delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main component that wraps all spending dialogs
export default function SpendingDialogs({
  spendingManager,
  spendings,
  handlePartialPaid,
  handleSaveNote,
  t,
  loading,
  unpaid,
}) {
  const currentItem = spendings.find((s) => s.id === spendingManager.partialItemId);
  const noteItem = spendings.find((s) => s.id === spendingManager.noteEditId);

  return (
    <>
      {/* Partial payment dialog for all items */}
      <PartialPaymentDialog
        open={spendingManager.partialDialogOpen}
        onClose={() => spendingManager.setPartialDialogOpen(false)}
        amount={spendingManager.partialAmount}
        onAmountChange={spendingManager.setPartialAmount}
        error={spendingManager.partialError}
        onConfirm={handlePartialPaid}
        loading={loading}
        maxAmount={unpaid}
        title={t('partialPaidAmountAllItems')}
      />

      {/* Partial payment dialog for individual item */}
      <PartialPaymentDialog
        open={spendingManager.itemPartialDialogOpen}
        onClose={() => spendingManager.setItemPartialDialogOpen(false)}
        amount={spendingManager.itemPartialAmount}
        onAmountChange={spendingManager.setItemPartialAmount}
        error={spendingManager.itemPartialError}
        onConfirm={() => spendingManager.handleItemPartialPaid(spendings)}
        loading={loading}
        maxAmount={
          currentItem
            ? currentItem.amount - (currentItem.amountPaid || 0)
            : 0
        }
        title={t('partialPaidAmountItem')}
      />

      {/* Note dialog */}
      <NoteDialog
        open={spendingManager.noteDialogOpen}
        onClose={() => spendingManager.setNoteDialogOpen(false)}
        noteText={spendingManager.noteText}
        onNoteChange={spendingManager.setNoteText}
        onSave={handleSaveNote}
        loading={loading}
        itemName={noteItem?.name || ''}
      />

      {/* Delete item confirmation dialog */}
      <Dialog
        open={spendingManager.deleteItemId !== null}
        onClose={() => spendingManager.setDeleteItemId(null)}
      >
        <DialogTitle>{t('deleteItem')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('deleteItemConfirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => spendingManager.setDeleteItemId(null)} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button
            onClick={spendingManager.handleConfirmDeleteItem}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete item confirmation dialog - TEMPORARILY DISABLED FOR DEBUGGING */}
      {/*
      <Dialog
        open={spendingManager.deleteItemId !== null}
        onClose={() => {
          console.log('Delete dialog onClose called');
          spendingManager.setDeleteItemId(null);
        }}
      >
        <DialogTitle>{t('deleteItem')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('deleteItemConfirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            console.log('Delete dialog Cancel button clicked');
            spendingManager.setDeleteItemId(null);
          }} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button
            onClick={spendingManager.handleConfirmDeleteItem}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
      */}
    </>
  );
}
