import { CustomError } from "../../utils/customError";
import { getPriceQuoteByIdService } from "../../price_quotes/services/price_quotes.service";
import {
  findAllQuoteItemsDal,
  findQuoteItemByIdDal,
  insertQuoteItemDal,
  updateQuoteItemByIdDal,
  deleteQuoteItemDal,
} from "../dal/quote_items.dal";
import { requiresSourceId } from "../helpers/quote_items.helpers";
import { CreateQuoteItemDto, UpdateQuoteItemDto } from "../types/quote_items.types";

export const getAllQuoteItemsService = async (
  quoteId: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getPriceQuoteByIdService(quoteId, projectId, contractorId);
    return await findAllQuoteItemsDal(quoteId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getQuoteItemByIdService = async (
  id: number,
  quoteId: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getPriceQuoteByIdService(quoteId, projectId, contractorId);
    const item = await findQuoteItemByIdDal(id, quoteId);
    if (!item) throw new CustomError("Quote item not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addQuoteItemService = async (
  quoteId: number,
  projectId: string,
  contractorId: string,
  dto: CreateQuoteItemDto,
) => {
  try {
    await getPriceQuoteByIdService(quoteId, projectId, contractorId);
    if (requiresSourceId(dto.type) && !dto.sourceId)
      throw new CustomError(`sourceId is required for type ${dto.type}`, 400);
    return await insertQuoteItemDal(quoteId, dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateQuoteItemService = async (
  id: number,
  quoteId: number,
  projectId: string,
  contractorId: string,
  dto: UpdateQuoteItemDto,
) => {
  try {
    await getPriceQuoteByIdService(quoteId, projectId, contractorId);
    const item = await updateQuoteItemByIdDal(id, quoteId, dto);
    if (!item) throw new CustomError("Quote item not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeQuoteItemService = async (
  id: number,
  quoteId: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getPriceQuoteByIdService(quoteId, projectId, contractorId);
    const deleted = await deleteQuoteItemDal(id, quoteId);
    if (!deleted) throw new CustomError("Quote item not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
