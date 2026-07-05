import type { QuoteItem, QuoteStatus } from "../types/quotes.types";

export const quoteStatusConfig: Record<
  QuoteStatus,
  { label: string; color: string }
> = {
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

// Pure calculation helpers for price quotes.
// Values arrive from the API as numeric strings (PostgreSQL "numeric" type),
// so each value is explicitly converted to Number before any math.

// Line total = quantity * unit price, calculated per quote item
export const calcLineTotal = (item: QuoteItem): number =>
  Number(item.quantity) * Number(item.unitPrice);

// Grand total = sum of all line totals, accumulated with reduce
export const calcGrandTotal = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + calcLineTotal(item), 0);

// Formats an amount as Israeli Shekels with exactly 2 decimal places,
// using the he-IL locale (e.g. 12345.5 -> "₪12,345.50")
export const formatCurrency = (amount: number): string =>
  `₪${amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
