import { QuoteItemType } from "../types/quote_items.types";

export const requiresSourceId = (type: QuoteItemType): boolean =>
  type === QuoteItemType.MATERIAL || type === QuoteItemType.LABOR;
