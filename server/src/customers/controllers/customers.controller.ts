import { Response } from "express";
import { handleError } from "../../utils/handleError";
import {
  getCustomersByContractorService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  removeCustomerService,
} from "../services/customers.service";
import { AuthRequest } from "../../types/auth.types";

export const getAllCustomersController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const items = await getCustomersByContractorService(req.user!.id);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getCustomersByContractorController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { contractorId } = req.params;
    const items = await getCustomersByContractorService(contractorId as string);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getCustomerByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const item = await getCustomerByIdService(id as string, userId);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const createCustomerController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const item = await createCustomerService(req.body, userId);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateCustomerController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const item = await updateCustomerService(id as string, req.body, userId);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeCustomerController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    await removeCustomerService(id as string, userId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
