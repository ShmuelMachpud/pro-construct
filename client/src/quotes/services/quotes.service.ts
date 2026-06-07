import axiosInstance from "../../global/services/axiosServer";
import type {
  PriceQuote,
  PriceQuoteWithProject,
  QuoteItem,
  CreatePriceQuoteDto,
  UpdatePriceQuoteDto,
  CreateQuoteItemDto,
  UpdateQuoteItemDto,
} from "../types/quotes.types";

export const getAllQuotes = async (): Promise<PriceQuoteWithProject[]> => {
  const { data } = await axiosInstance.get("/quotes");
  return data;
};

export const getPriceQuotes = async (projectId: string): Promise<PriceQuote[]> => {
  const { data } = await axiosInstance.get(`/projects/${projectId}/quotes`);
  return data;
};

export const createPriceQuote = async (
  projectId: string,
  dto: CreatePriceQuoteDto,
): Promise<PriceQuote> => {
  const { data } = await axiosInstance.post(`/projects/${projectId}/quotes`, dto);
  return data;
};

export const updatePriceQuote = async (
  projectId: string,
  quoteId: number,
  dto: UpdatePriceQuoteDto,
): Promise<PriceQuote> => {
  const { data } = await axiosInstance.patch(`/projects/${projectId}/quotes/${quoteId}`, dto);
  return data;
};

export const deletePriceQuote = async (projectId: string, quoteId: number): Promise<void> => {
  await axiosInstance.delete(`/projects/${projectId}/quotes/${quoteId}`);
};

export const getQuoteItems = async (projectId: string, quoteId: number): Promise<QuoteItem[]> => {
  const { data } = await axiosInstance.get(`/projects/${projectId}/quotes/${quoteId}/items`);
  return data;
};

export const addQuoteItem = async (
  projectId: string,
  quoteId: number,
  dto: CreateQuoteItemDto,
): Promise<QuoteItem> => {
  const { data } = await axiosInstance.post(
    `/projects/${projectId}/quotes/${quoteId}/items`,
    dto,
  );
  return data;
};

export const updateQuoteItem = async (
  projectId: string,
  quoteId: number,
  itemId: number,
  dto: UpdateQuoteItemDto,
): Promise<QuoteItem> => {
  const { data } = await axiosInstance.patch(
    `/projects/${projectId}/quotes/${quoteId}/items/${itemId}`,
    dto,
  );
  return data;
};

export const deleteQuoteItem = async (
  projectId: string,
  quoteId: number,
  itemId: number,
): Promise<void> => {
  await axiosInstance.delete(`/projects/${projectId}/quotes/${quoteId}/items/${itemId}`);
};
