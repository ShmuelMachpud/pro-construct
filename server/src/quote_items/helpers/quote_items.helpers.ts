import { QuoteItemType } from "../types/quote_items.types";

// Business validation rules for quote items, kept as pure functions
// so they can be unit-tested and reused by every service method.

// A MATERIAL item must reference a source material from the
// contractor's personal price list; LABOR / OTHER items do not
export const requiresSourceId = (type: QuoteItemType): boolean =>
  type === QuoteItemType.MATERIAL;

// Quantity must be strictly positive (zero or negative is rejected)
export const isValidQuantity = (quantity: number): boolean => quantity > 0;

// Unit price may be zero (free item) but never negative
export const isValidUnitPrice = (unitPrice: number): boolean => unitPrice >= 0;
