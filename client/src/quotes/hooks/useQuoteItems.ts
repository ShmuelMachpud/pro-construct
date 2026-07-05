import { useState, useEffect } from "react";
import {
  getQuoteItems,
  addQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
} from "../services/quotes.service";
import type {
  QuoteItem,
  CreateQuoteItemDto,
  UpdateQuoteItemDto,
} from "../types/quotes.types";
// Custom hook that owns the quote-items state for a single quote.
// All server communication goes through the quotes service layer;
// components only consume the returned handlers.
export const useQuoteItems = (projectId: string, quoteId: number) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial fetch of all items for this quote
  const load = () => {
    setLoading(true);
    getQuoteItems(projectId, quoteId)
      .then(setItems)
      .catch(() => setError("שגיאה בטעינת הפריטים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [projectId, quoteId]);

  // Creates the item on the server, then appends the returned entity
  // to local state - no full refetch is needed
  const handleAdd = async (dto: CreateQuoteItemDto): Promise<void> => {
    const created = await addQuoteItem(projectId, quoteId, dto);
    setItems((prev) => [...prev, created]);
  };

  // Optimistically replaces the updated item in local state
  const handleUpdate = async (
    itemId: number,
    dto: UpdateQuoteItemDto,
  ): Promise<void> => {
    const updated = await updateQuoteItem(projectId, quoteId, itemId, dto);
    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
  };

  // Deletes on the server and filters the item out of local state
  const handleDelete = async (itemId: number): Promise<void> => {
    await deleteQuoteItem(projectId, quoteId, itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return { items, loading, error, handleAdd, handleUpdate, handleDelete };
};
