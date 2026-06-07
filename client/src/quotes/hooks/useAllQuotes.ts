import { useState, useEffect, useCallback } from "react";
import { getAllQuotes, createPriceQuote, deletePriceQuote } from "../services/quotes.service";
import type { PriceQuoteWithProject, CreatePriceQuoteDto } from "../types/quotes.types";

export const useAllQuotes = () => {
  const [quotes, setQuotes] = useState<PriceQuoteWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuotes = useCallback(async () => {
    try {
      const data = await getAllQuotes();
      setQuotes(data);
    } catch {
      setError("שגיאה בטעינת הצעות המחיר");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const handleCreate = async (projectId: string, dto: CreatePriceQuoteDto) => {
    const created = await createPriceQuote(projectId, dto);
    await fetchQuotes();
    return created;
  };

  const handleDelete = async (projectId: string, quoteId: number) => {
    await deletePriceQuote(projectId, quoteId);
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
  };

  return { quotes, loading, error, handleCreate, handleDelete };
};
