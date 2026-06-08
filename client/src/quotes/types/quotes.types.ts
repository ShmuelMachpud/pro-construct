import type { Project } from "../../projects/types/projects.types";

export type QuoteStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED";
export type QuoteItemType = "MATERIAL" | "LABOR" | "OTHER";

export interface PriceQuote {
  id: number;
  projectId: string;
  title: string;
  status: QuoteStatus;
  validUntil: string | null;
  notes: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: number;
  quoteId: number;
  type: QuoteItemType;
  sourceId: number | null;
  description: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
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

export interface ProjectWithQuoteCount extends Project {
  quoteCount: number;
}

export interface PriceQuoteWithProject extends PriceQuote {
  projectName: string;
}
