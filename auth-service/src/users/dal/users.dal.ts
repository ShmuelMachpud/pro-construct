import { AppDataSource } from "../../config/database";
import { User } from "../model/users.entity";
import { CreateUserDto, SetApprovalData } from "../types/users.types";

const userRepository = AppDataSource.getRepository(User);

export const findAllUsersDal = async () => {
  return await userRepository.find({ order: { createdAt: "DESC" } });
};

export const findUserByIdDal = async (id: string) => {
  return await userRepository.findOne({ where: { id } });
};

export const findUserByEmailDal = async (email: string) => {
  return await userRepository.findOne({ where: { email } });
};

export const findPendingUsersDal = async (): Promise<User[]> => {
  return await userRepository.find({ where: { isApproved: false } });
};

export const setApprovedUserDal = async (id: string, data: SetApprovalData) => {
  const userUpdated = await userRepository.update(id, data);
  return userUpdated;
};

export const insertUserDal = async (data: CreateUserDto) => {
  const item = userRepository.create(data);
  return await userRepository.save(item);
};

