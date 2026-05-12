import { AppDataSource } from "../../config/database";
import { Client } from "../model/client.entity";

const clientRepository = AppDataSource.getRepository(Client);

export const createClient = async (data: Partial<Client>): Promise<Client> => {
  const client = clientRepository.create(data);
  return await clientRepository.save(client);
};

export const getClientsByContractor = async (contractorId: string): Promise<Client[]> => {
  return await clientRepository.find({
    where: { contractorId },
    order: { createdAt: "DESC" },
  });
};

export const getClientById = async (id: number, contractorId: string): Promise<Client | null> => {
  return await clientRepository.findOne({
    where: { id, contractorId },
  });
};

export const updateClient = async (id: number, contractorId: string, data: Partial<Client>): Promise<Client | null> => {
  await clientRepository.update({ id, contractorId }, data);
  return await clientRepository.findOne({ where: { id, contractorId } });
};

export const deleteClient = async (id: number, contractorId: string): Promise<boolean> => {
  const result = await clientRepository.delete({ id, contractorId });
  return (result.affected ?? 0) > 0;
};
