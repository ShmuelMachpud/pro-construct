import { QuoteItemType } from "../types/quote_items.types";

export const requiresSourceId = (type: QuoteItemType): boolean =>
  type === QuoteItemType.MATERIAL;

export const isValidQuantity = (quantity: number): boolean => quantity > 0;

export const isValidUnitPrice = (unitPrice: number): boolean => unitPrice >= 0;
