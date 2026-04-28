import { Client } from "../entities/Client";
import {
  createClient,
  getClientsByContractor,
  getClientById,
  updateClient,
  deleteClient,
} from "./client.dal";

export interface CreateClientDto {
  name: string;
  type: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  notes?: string;
}

export const createClientService = async (dto: CreateClientDto, contractorId: number): Promise<Client> => {
  return await createClient({ ...dto, contractorId } as any);
};

export const getClientsService = async (contractorId: number): Promise<Client[]> => {
  return await getClientsByContractor(contractorId);
};

export const getClientByIdService = async (id: number, contractorId: number): Promise<Client> => {
  const client = await getClientById(id, contractorId);
  if (!client) throw new Error("Client not found");
  return client;
};

export const updateClientService = async (id: number, contractorId: number, dto: Partial<CreateClientDto>): Promise<Client> => {
  const client = await updateClient(id, contractorId, dto as any);
  if (!client) throw new Error("Client not found");
  return client;
};

export const deleteClientService = async (id: number, contractorId: number): Promise<void> => {
  const deleted = await deleteClient(id, contractorId);
  if (!deleted) throw new Error("Client not found");
};
