import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";

const clientRepository = AppDataSource.getRepository(Client);

export const createClient = async (data: Partial<Client>): Promise<Client> => {
  const client = clientRepository.create(data);
  return await clientRepository.save(client);
};

export const getClientsByContractor = async (contractorId: number): Promise<Client[]> => {
  return await clientRepository.find({
    where: { contractorId },
    order: { createdAt: "DESC" },
  });
};

export const getClientById = async (id: number, contractorId: number): Promise<Client | null> => {
  return await clientRepository.findOne({
    where: { id, contractorId },
  });
};