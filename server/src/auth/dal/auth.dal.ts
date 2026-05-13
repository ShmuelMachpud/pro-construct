import { AppDataSource } from "../../config/database";
import { User } from "../model/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.findOne({ where: { email } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await userRepository.findOne({ where: { id } });
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const user = userRepository.create(data);
  return await userRepository.save(user);
};

export const setUserApproved = async (id: string): Promise<User> => {
  await userRepository.update(id, { isApproved: true });
  return (await userRepository.findOne({ where: { id } }))!;
};

export const findPendingContractors = async (): Promise<User[]> => {
  return await userRepository.find({ where: { isApproved: false } });
};

export const findAllUsers = async (): Promise<User[]> => {
  return await userRepository.find({ order: { createdAt: "DESC" } });
};
