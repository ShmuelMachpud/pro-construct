import type { QuoteItem, QuoteStatus } from "../types/quotes.types";

export const quoteStatusConfig: Record<QuoteStatus, { label: string; color: string }> = {
  DRAFT: { label: "טיוטה", color: "#9E9E9E" },
  SENT: { label: "נשלחה", color: "#2196F3" },
  APPROVED: { label: "אושרה", color: "#4CAF50" },
  REJECTED: { label: "נדחתה", color: "#F44336" },
  EXPIRED: { label: "פגה תוקף", color: "#FF9800" },
};

export const quoteItemTypeLabel: Record<string, string> = {
  MATERIAL: "חומר",
  LABOR: "עבודה",
  OTHER: "אחר",
};

export const calcLineTotal = (item: QuoteItem): number =>
  Number(item.quantity) * Number(item.unitPrice);

export const calcGrandTotal = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + calcLineTotal(item), 0);

export const formatCurrency = (amount: number): string =>
  `₪${amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
