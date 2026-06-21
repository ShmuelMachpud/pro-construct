import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllQuotesByContractorService,
  getAllPriceQuotesService,
  getPriceQuoteByIdService,
  createPriceQuoteService,
  updatePriceQuoteService,
  removePriceQuoteService,
} from "../services/price_quotes.service";

export const getQuotesByContractorAdminController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { contractorId } = req.params;
    const quotes = await getAllQuotesByContractorService(contractorId as string);
    res.status(200).json(quotes);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllQuotesByContractorController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const quotes = await getAllQuotesByContractorService(contractorId);
    res.status(200).json(quotes);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllPriceQuotesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quotes = await getAllPriceQuotesService(projectId, contractorId);
    res.status(200).json(quotes);
  } catch (error) {
    handleError(error, res);
  }
};

export const getPriceQuoteByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const quote = await getPriceQuoteByIdService(
      Number(quoteId),
      projectId,
      contractorId,
    );
    res.status(200).json(quote);
  } catch (error) {
    handleError(error, res);
  }
};

export const createPriceQuoteController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quote = await createPriceQuoteService(
      projectId,
      contractorId,
      req.body,
    );
    res.status(201).json(quote);
  } catch (error) {
    handleError(error, res);
  }
};

export const updatePriceQuoteController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const quote = await updatePriceQuoteService(
      Number(quoteId),
      projectId,
      contractorId,
      req.body,
    );
    res.status(200).json(quote);
  } catch (error) {
    handleError(error, res);
  }
};

export const removePriceQuoteController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    await removePriceQuoteService(Number(quoteId), projectId, contractorId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
