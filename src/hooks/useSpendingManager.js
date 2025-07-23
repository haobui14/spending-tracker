import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

export default function useSpendingManager(data, saveData, updateData, currentTabKey, setTabSpendings) {
  const { t } = useTranslation();
  
  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  
  // Edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  
  // Dialog states
  const [partialDialogOpen, setPartialDialogOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [partialError, setPartialError] = useState("");
  
  const [itemPartialDialogOpen, setItemPartialDialogOpen] = useState(false);
  const [itemPartialAmount, setItemPartialAmount] = useState("");
  const [itemPartialError, setItemPartialError] = useState("");
  const [partialItemId, setPartialItemId] = useState(null);
  
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteEditId, setNoteEditId] = useState(null);
  
  // Force deleteItemId to always start as null
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleAddSpending = (e, spendings, customSpending = null) => {
    e.preventDefault();
    if (!name || !amount || isNaN(amount)) return;
    
    const newItem = customSpending || {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      paid: false,
      amountPaid: 0,
      note: "",
      category: 'general',
    };
    
    const newItems = [...spendings, newItem];
    const newTotal = newItems.reduce((sum, s) => sum + s.amount, 0);
    const newPaid = newItems
      .filter((s) => (s.amountPaid || 0) >= s.amount)
      .reduce((sum, s) => sum + s.amount, 0);
    
    let newStatus = "unpaid";
    if (newPaid === newTotal && newTotal > 0) newStatus = "paid";
    else if (newPaid > 0) newStatus = "partial";

    if (currentTabKey === "main") {
      saveData({
        ...data,
        items: newItems,
        total: newTotal,
        paid: newPaid,
        status: newStatus,
        createdAt: data?.createdAt || new Date(),
        updatedAt: new Date(),
      });
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: newItems,
          total: newTotal,
          paid: newPaid,
          status: newStatus,
          updatedAt: new Date(),
        },
      }));
    }
    
    setName("");
    setAmount("");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category || 'general');
  };

  const handleEditSave = (id) => {
    if (!editName || !editAmount || isNaN(editAmount)) return;
    
    if (currentTabKey === "main") {
      updateData(id, { 
        name: editName, 
        amount: parseFloat(editAmount),
        category: editCategory 
      });
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: prev[currentTabKey].items.map((item) =>
            item.id === id
              ? { ...item, name: editName, amount: parseFloat(editAmount), category: editCategory }
              : item
          ),
        },
      }));
    }
    
    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditAmount("");
    setEditCategory("");
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
  };

  const handleConfirmDeleteItem = () => {
    if (deleteItemId === null) return;
    
    if (currentTabKey === "main") {
      updateData(deleteItemId, { _delete: true });
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: prev[currentTabKey].items.filter(
            (item) => item.id !== deleteItemId
          ),
        },
      }));
    }
    
    setDeleteItemId(null);
  };

  const handleMarkPaid = (id, undo = false, spendings) => {
    const item = spendings.find((s) => s.id === id);
    if (!item) return;

    const updatedStatus = {
      paid: !undo,
      amountPaid: !undo ? item.amount : 0,
    };

    if (currentTabKey === "main") {
      updateData(id, updatedStatus);
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: prev[currentTabKey].items.map((s) =>
            s.id === id ? { ...s, ...updatedStatus } : s
          ),
        },
      }));
    }
  };

  const handleOpenNoteDialog = (item) => {
    setNoteEditId(item.id);
    setNoteText(item.note || "");
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (currentTabKey === "main") {
      updateData(noteEditId, { note: noteText });
    } else {
      setTabSpendings((prev) => ({
        ...prev,
        [currentTabKey]: {
          ...prev[currentTabKey],
          items: prev[currentTabKey].items.map((item) =>
            item.id === noteEditId ? { ...item, note: noteText } : item
          ),
        },
      }));
    }
    
    setNoteDialogOpen(false);
    setNoteEditId(null);
    setNoteText("");
  };

  const handleOpenItemPartialDialog = (item) => {
    setPartialItemId(item.id);
    setItemPartialAmount("");
    setItemPartialError("");
    setItemPartialDialogOpen(true);
  };

  const handleItemPartialPaid = (spendings) => {
    const item = spendings.find((s) => s.id === partialItemId);
    if (!item) return;

    const alreadyPaid = item.amountPaid || 0;
    const left = item.amount - alreadyPaid;
    const partial = parseFloat(itemPartialAmount);

    if (isNaN(partial) || partial <= 0 || partial > left) {
      setItemPartialError(t('enterValidAmount', { amount: left }));
      return;
    }

    const newAmountPaid = alreadyPaid + partial;
    const updatedItem = {
      ...item,
      amountPaid: newAmountPaid,
      paid: newAmountPaid >= item.amount,
    };

    const updatedItems = spendings.map((s) =>
      s.id === item.id ? updatedItem : s
    );

    const newPaid = updatedItems
      .filter((s) => (s.amountPaid || 0) >= s.amount)
      .reduce((sum, s) => sum + s.amount, 0);
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);
    let newStatus = "partial";
    if (newPaid === newTotal && newTotal > 0) newStatus = "paid";

    if (currentTabKey === "main") {
      saveData({
        ...data,
        items: updatedItems,
        total: newTotal,
        paid: newPaid,
        status: newStatus,
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
          status: newStatus,
          updatedAt: new Date(),
        },
      }));
    }

    setItemPartialDialogOpen(false);
    setPartialItemId(null);
    setItemPartialAmount("");
  };

  // Handle partial payment for all items (batch partial payment)
  const handlePartialPaid = (spendings) => {
    const partial = parseFloat(partialAmount);
    const totalUnpaid = spendings.reduce((sum, s) => {
      const remaining = s.amount - (s.amountPaid || 0);
      return sum + (remaining > 0 ? remaining : 0);
    }, 0);

    if (isNaN(partial) || partial <= 0 || partial > totalUnpaid) {
      setPartialError(t('enterValidAmount', { amount: totalUnpaid.toFixed(2) }));
      return;
    }

    // Distribute the partial payment across unpaid items
    let remainingAmount = partial;
    const updatedItems = spendings.map((item) => {
      if (remainingAmount <= 0 || item.paid) return item;
      
      const currentlyPaid = item.amountPaid || 0;
      const remaining = item.amount - currentlyPaid;
      
      if (remaining <= 0) return item;
      
      const paymentForThisItem = Math.min(remaining, remainingAmount);
      remainingAmount -= paymentForThisItem;
      
      const newAmountPaid = currentlyPaid + paymentForThisItem;
      
      return {
        ...item,
        amountPaid: newAmountPaid,
        paid: newAmountPaid >= item.amount,
      };
    });

    const newPaid = updatedItems.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);
    let newStatus = "partial";
    if (newPaid === newTotal && newTotal > 0) newStatus = "paid";

    if (currentTabKey === "main") {
      saveData({
        ...data,
        items: updatedItems,
        total: newTotal,
        paid: newPaid,
        status: newStatus,
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
          status: newStatus,
          updatedAt: new Date(),
        },
      }));
    }

    setPartialDialogOpen(false);
    setPartialAmount("");
    setPartialError("");
  };

  return {
    // Form state
    name,
    setName,
    amount,
    setAmount,
    
    // Edit state
    editId,
    editName,
    setEditName,
    editAmount,
    setEditAmount,
    editCategory,
    setEditCategory,
    
    // Dialog states
    partialDialogOpen,
    setPartialDialogOpen,
    partialAmount,
    setPartialAmount,
    partialError,
    setPartialError,
    
    itemPartialDialogOpen,
    setItemPartialDialogOpen,
    itemPartialAmount,
    setItemPartialAmount,
    itemPartialError,
    setItemPartialError,
    partialItemId,
    
    noteDialogOpen,
    setNoteDialogOpen,
    noteText,
    setNoteText,
    noteEditId,
    
    deleteItemId,
    setDeleteItemId,
    
    // Handlers
    handleAddSpending,
    handleEdit,
    handleEditSave,
    handleCancelEdit,
    handleDelete,
    handleConfirmDeleteItem,
    handleMarkPaid,
    handleOpenNoteDialog,
    handleSaveNote,
    handleOpenItemPartialDialog,
    handleItemPartialPaid,
    handlePartialPaid,
  };
}
