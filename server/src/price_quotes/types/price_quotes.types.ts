export enum QuoteStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface CreatePriceQuoteDto {
  title: string;
  validUntil?: string;
  notes?: string;
}

export interface UpdatePriceQuoteDto {
  title?: string;
  status?: QuoteStatus;
  validUntil?: string | null;
  notes?: string | null;
}
