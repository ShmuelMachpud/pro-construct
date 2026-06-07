import { CustomError } from "../../utils/customError";
import { getProjectByIdAndContractorService } from "../../projects/services/projects.service";
import {
  findAllQuotesByContractorDal,
  findAllPriceQuotesDal,
  findPriceQuoteByIdDal,
  insertPriceQuoteDal,
  updatePriceQuoteByIdDal,
  deletePriceQuoteDal,
} from "../dal/price_quotes.dal";
import { CreatePriceQuoteDto, UpdatePriceQuoteDto } from "../types/price_quotes.types";

export const getAllQuotesByContractorService = async (contractorId: string) => {
  try {
    return await findAllQuotesByContractorDal(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllPriceQuotesService = async (projectId: string, contractorId: string) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    return await findAllPriceQuotesDal(projectId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPriceQuoteByIdService = async (
  id: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const quote = await findPriceQuoteByIdDal(id, projectId);
    if (!quote) throw new CustomError("Price quote not found", 404);
    return quote;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createPriceQuoteService = async (
  projectId: string,
  contractorId: string,
  dto: CreatePriceQuoteDto,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    return await insertPriceQuoteDal(projectId, dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePriceQuoteService = async (
  id: number,
  projectId: string,
  contractorId: string,
  dto: UpdatePriceQuoteDto,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const quote = await updatePriceQuoteByIdDal(id, projectId, dto);
    if (!quote) throw new CustomError("Price quote not found", 404);
    return quote;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removePriceQuoteService = async (
  id: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const deleted = await deletePriceQuoteDal(id, projectId);
    if (!deleted) throw new CustomError("Price quote not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
