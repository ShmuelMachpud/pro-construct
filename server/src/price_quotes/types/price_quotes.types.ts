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

export interface PriceQuoteWithProject {
  id: number;
  projectId: string;
  projectName: string;
  title: string;
  status: QuoteStatus;
  validUntil: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
