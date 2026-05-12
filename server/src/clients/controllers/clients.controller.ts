import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.types";
import {
  createClientService,
  getClientsService,
  getClientByIdService,
  updateClientService,
  deleteClientService,
} from "../services/clients.service";

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await createClientService(req.body, req.user!.id);
    res.status(201).json(client);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await getClientsService(req.user!.id);
    res.status(200).json(clients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const client = await getClientByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json(client);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const client = await updateClientService(Number(req.params.id), req.user!.id, req.body);
    res.status(200).json(client);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    await deleteClientService(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
