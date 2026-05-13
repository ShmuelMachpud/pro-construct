import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.types";
import {
  createClientService,
  getClientsService,
  getClientByIdService,
  updateClientService,
  deleteClientService,
} from "../services/clients.service";
import { handleError } from "../../utils/handleError";

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await createClientService(req.body, req.user!.id);
    res.status(201).json(client);
  } catch (error) {
    handleError(error, res);
  }
};

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await getClientsService(req.user!.id);
    res.status(200).json(clients);
  } catch (error) {
    handleError(error, res);
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const client = await getClientByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json(client);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await updateClientService(Number(req.params.id), req.user!.id, req.body);
    res.status(200).json(client);
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    await deleteClientService(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
