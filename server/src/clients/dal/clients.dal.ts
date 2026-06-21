import { AppDataSource } from "../../config/database";
import { Client } from "../model/client.entity";
import { CreateClientInterface, UpdateClientDto } from "../types/clients.types";

const repository = AppDataSource.getRepository(Client);

export const findAllClientsDal = async (userId: string) => {
  return await repository.find({
    where: { contractorId: userId },
    order: { createdAt: "DESC" },
  });
};

export const findClientsByContractorDal = async (contractorId: string) => {
  return await repository.find({ where: { contractorId }, order: { createdAt: "DESC" } });
};

export const findClientByIdDal = async (id: string, userId: string) => {
  return await repository.findOne({ where: { id, contractorId: userId } });
};

export const insertClientDal = async (data: CreateClientInterface) => {
  const item = repository.create(data);
  return await repository.save(item);
};

export const updateClientByIdDal = async (
  id: string,
  data: UpdateClientDto,
  userId: string,
) => {
  await repository.update(id, data);
  return await repository.findOne({ where: { id, contractorId: userId } });
};

export const deleteClientDal = async (id: string, userId: string) => {
  const result = await repository.delete({ id, contractorId: userId });
  return (result.affected ?? 0) > 0;
};
