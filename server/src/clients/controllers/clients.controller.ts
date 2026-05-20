import { Response } from "express";
import { handleError } from "../../utils/handleError";
import {
  getAllClientsService,
  getClientByIdService,
  createClientService,
  updateClientService,
  removeClientService,
} from "../services/clients.service";
import { AuthRequest } from "../../types/auth.types";

export const getAllClientsController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const items = await getAllClientsService(userId);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getClientByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const item = await getClientByIdService(id as string, userId);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const createClientController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const item = await createClientService(req.body, userId);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateClientController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const item = await updateClientService(id as string, req.body, userId);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeClientController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    await removeClientService(id as string, userId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
