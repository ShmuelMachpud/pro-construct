import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllQuoteItemsService,
  getQuoteItemByIdService,
  addQuoteItemService,
  updateQuoteItemService,
  removeQuoteItemService,
} from "../services/quote_items.service";

export const getAllQuoteItemsController = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const items = await getAllQuoteItemsService(Number(quoteId), projectId, contractorId);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getQuoteItemByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const itemId = req.params.itemId as string;
    const item = await getQuoteItemByIdService(
      Number(itemId),
      Number(quoteId),
      projectId,
      contractorId,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const addQuoteItemController = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const item = await addQuoteItemService(Number(quoteId), projectId, contractorId, req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateQuoteItemController = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const itemId = req.params.itemId as string;
    const item = await updateQuoteItemService(
      Number(itemId),
      Number(quoteId),
      projectId,
      contractorId,
      req.body,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeQuoteItemController = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const quoteId = req.params.quoteId as string;
    const itemId = req.params.itemId as string;
    await removeQuoteItemService(Number(itemId), Number(quoteId), projectId, contractorId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
