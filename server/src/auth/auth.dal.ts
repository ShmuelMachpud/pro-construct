import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.findOne({ where: { email } });
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const user = userRepository.create(data);
  return await userRepository.save(user);
};