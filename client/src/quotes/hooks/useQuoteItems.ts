import { useState, useEffect } from "react";
import {
  getQuoteItems,
  addQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
} from "../services/quotes.service";
import type { QuoteItem, CreateQuoteItemDto, UpdateQuoteItemDto } from "../types/quotes.types";

export const useQuoteItems = (projectId: string, quoteId: number) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getQuoteItems(projectId, quoteId)
      .then(setItems)
      .catch(() => setError("שגיאה בטעינת הפריטים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [projectId, quoteId]);

  const handleAdd = async (dto: CreateQuoteItemDto): Promise<void> => {
    const created = await addQuoteItem(projectId, quoteId, dto);
    setItems((prev) => [...prev, created]);
  };

  const handleUpdate = async (itemId: number, dto: UpdateQuoteItemDto): Promise<void> => {
    const updated = await updateQuoteItem(projectId, quoteId, itemId, dto);
    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
  };

  const handleDelete = async (itemId: number): Promise<void> => {
    await deleteQuoteItem(projectId, quoteId, itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return { items, loading, error, handleAdd, handleUpdate, handleDelete };
};
