import { AppDataSource } from "../../config/database";
import { Customer } from "../model/customer.entity";
import {
  CreateCustomerInterface,
  UpdateCustomerDto,
} from "../types/customer.types";

const repository = AppDataSource.getRepository(Customer);

export const findCustomersByContractorDal = async (contractorId: string) => {
  return await repository.find({
    where: { contractorId },
    order: { createdAt: "DESC" },
  });
};

export const findCustomerByIdDal = async (id: string, userId: string) => {
  return await repository.findOne({ where: { id, contractorId: userId } });
};

export const insertCustomerDal = async (data: CreateCustomerInterface) => {
  const item = repository.create(data);
  return await repository.save(item);
};

export const updateCustomerByIdDal = async (
  id: string,
  data: UpdateCustomerDto,
  userId: string,
) => {
  await repository.update(id, data);
  return await repository.findOne({ where: { id, contractorId: userId } });
};

export const deleteCustomerDal = async (id: string, userId: string) => {
  const result = await repository.delete({ id, contractorId: userId });
  return (result.affected ?? 0) > 0;
};
