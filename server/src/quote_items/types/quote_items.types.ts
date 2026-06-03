export enum QuoteItemType {
  MATERIAL = "MATERIAL",
  LABOR = "LABOR",
  OTHER = "OTHER",
}

export interface CreateQuoteItemDto {
  type: QuoteItemType;
  sourceId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateQuoteItemDto {
  description?: string;
  quantity?: number;
  unitPrice?: number;
}
