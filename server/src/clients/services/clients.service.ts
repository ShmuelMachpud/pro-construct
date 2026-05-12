import { Client } from "../model/client.entity";
import {
  createClient,
  getClientsByContractor,
  getClientById,
  updateClient,
  deleteClient,
} from "../dal/clients.dal";
import { CreateClientDto } from "../types/clients.types";

export { CreateClientDto };

export const createClientService = async (dto: CreateClientDto, contractorId: string): Promise<Client> => {
  return await createClient({ ...dto, contractorId } as any);
};

export const getClientsService = async (contractorId: string): Promise<Client[]> => {
  return await getClientsByContractor(contractorId);
};

export const getClientByIdService = async (id: number, contractorId: string): Promise<Client> => {
  const client = await getClientById(id, contractorId);
  if (!client) throw new Error("Client not found");
  return client;
};

export const updateClientService = async (id: number, contractorId: string, dto: Partial<CreateClientDto>): Promise<Client> => {
  const client = await updateClient(id, contractorId, dto as any);
  if (!client) throw new Error("Client not found");
  return client;
};

export const deleteClientService = async (id: number, contractorId: string): Promise<void> => {
  const deleted = await deleteClient(id, contractorId);
  if (!deleted) throw new Error("Client not found");
};
