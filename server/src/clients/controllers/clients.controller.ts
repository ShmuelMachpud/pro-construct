import { Response } from "express";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import {
  createClientService,
  getClientsService,
  getClientByIdService,
  updateClientService,
  deleteClientService,
} from "../services/clients.service";

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const client = await createClientService(req.body, contractorId);
    res.status(201).json(client);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const clients = await getClientsService(contractorId);
    res.status(200).json(clients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const client = await getClientByIdService(Number(req.params.id), contractorId);
    res.status(200).json(client);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const client = await updateClientService(Number(req.params.id), contractorId, req.body);
    res.status(200).json(client);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    await deleteClientService(Number(req.params.id), contractorId);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
