import { useState, useEffect } from "react";
import {
  getPriceQuotes,
  createPriceQuote,
  updatePriceQuote,
  deletePriceQuote,
} from "../services/quotes.service";
import type { PriceQuote, CreatePriceQuoteDto, UpdatePriceQuoteDto } from "../types/quotes.types";

export const useQuotes = (projectId: string) => {
  const [quotes, setQuotes] = useState<PriceQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getPriceQuotes(projectId)
      .then(setQuotes)
      .catch(() => setError("שגיאה בטעינת ההצעות"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [projectId]);

  const handleCreate = async (dto: CreatePriceQuoteDto): Promise<void> => {
    const created = await createPriceQuote(projectId, dto);
    setQuotes((prev) => [created, ...prev]);
  };

  const handleUpdate = async (quoteId: number, dto: UpdatePriceQuoteDto): Promise<void> => {
    const updated = await updatePriceQuote(projectId, quoteId, dto);
    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? updated : q)));
  };

  const handleDelete = async (quoteId: number): Promise<void> => {
    await deletePriceQuote(projectId, quoteId);
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
  };

  return { quotes, loading, error, handleCreate, handleUpdate, handleDelete };
};
