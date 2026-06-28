import { AppDataSource } from "../../config/database";
import { User } from "../model/users.entity";
import { CreateUserDto, SetApprovalData } from "../types/users.types";

const repository = AppDataSource.getRepository(User);

export const findAllUsersDal = async () => {
  return await repository.find({ order: { createdAt: "DESC" } });
};

export const findUserByIdDal = async (id: string) => {
  return await repository.findOne({ where: { id } });
};

export const findUserByEmailDal = async (email: string) => {
  return await repository.findOne({ where: { email } });
};

export const findPendingUsersDal = async (): Promise<User[]> => {
  return await repository.find({ where: { isApproved: false } });
};

export const setApprovedUserDal = async (id: string, data: SetApprovalData) => {
  const userUpdated = await repository.update(id, data);
  return userUpdated;
};

export const insertUserDal = async (data: CreateUserDto) => {
  const item = repository.create(data);
  return await repository.save(item);
};

