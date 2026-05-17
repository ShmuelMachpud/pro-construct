import { UpdateResult } from "typeorm";
import { AppDataSource } from "../../config/database";
import { User } from "../model/user.entity";
// import { UpdateUserDto } from "../types/users.types";

const userRepository = AppDataSource.getRepository(User);

export const findAllUsers = async (): Promise<User[]> => {
  return await userRepository.find({ order: { createdAt: "DESC" } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await userRepository.findOne({ where: { id } });
};

export const findPendingContractors = async (): Promise<User[]> => {
  return await userRepository.find({ where: { isApproved: false } });
};

export const setUserApproved = async (
  id: string,
  subscriptionData: Partial<User>,
): Promise<UpdateResult> => {
  const userUpdated = await userRepository.update(id, {
    isApproved: true,
    ...subscriptionData,
  });
  return userUpdated;
};

// export const updateUser = async (id: string, dto: UpdateUserDto): Promise<User> => {
//   await userRepository.update(id, dto);
//   return (await userRepository.findOne({ where: { id } }))!;
// };
