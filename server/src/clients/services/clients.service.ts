import { Client } from "../model/client.entity";
import {
  createClient,
  getClientsByContractor,
  getClientById,
  updateClient,
  deleteClient,
} from "../dal/clients.dal";
import { CreateClientDto } from "../types/clients.types";
import { CustomError } from "../../utils/customError";

export { CreateClientDto };

export const createClientService = async (dto: CreateClientDto, contractorId: string): Promise<Client> => {
  try {
    return await createClient({ ...dto, contractorId } as any);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getClientsService = async (contractorId: string): Promise<Client[]> => {
  try {
    return await getClientsByContractor(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getClientByIdService = async (id: number, contractorId: string): Promise<Client> => {
  try {
    const client = await getClientById(id, contractorId);
    if (!client) throw new CustomError("Client not found", 404);
    return client;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateClientService = async (id: number, contractorId: string, dto: Partial<CreateClientDto>): Promise<Client> => {
  try {
    const client = await updateClient(id, contractorId, dto as any);
    if (!client) throw new CustomError("Client not found", 404);
    return client;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteClientService = async (id: number, contractorId: string): Promise<void> => {
  try {
    const deleted = await deleteClient(id, contractorId);
    if (!deleted) throw new CustomError("Client not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
