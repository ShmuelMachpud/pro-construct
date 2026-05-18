import { CustomError } from "../../utils/customError";
import {
  CreateUserDto,
  UserRole,
  // UpdateUserDto,
} from "../types/users.types";
import {
  findAllUsersDal,
  findUserByIdDal,
  insertUserDal,
  findUserByEmailDal,
  findPendingUsersDal,
  setApprovedUserDal,
  // updateUserByIdDal,
  // deleteUserDal,
} from "../dal/users.dal";
import {
  normalizedApprovalData,
  normalizedUser,
  normalizedUsers,
} from "../helpers/users.helpers";

export const getAllUsersService = async () => {
  try {
    const users = await findAllUsersDal();
    return normalizedUsers(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserByIdService = async (id: string) => {
  try {
    const user = await findUserByIdDal(id);
    if (!user) throw new CustomError("User not found", 404);
    return normalizedUser(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserByEmailService = async (email: string) => {
  try {
    const user = await findUserByEmailDal(email);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPendingUsersService = async () => {
  try {
    const users = await findPendingUsersDal();
    return normalizedUsers(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const approveUserService = async (id: string) => {
  try {
    const user = await findUserByIdDal(id);
    if (!user) throw new CustomError("User not found", 404);

    if (user.role !== UserRole.CONTRACTOR)
      throw new CustomError("Only contractor accounts require approval", 400);

    if (user.isApproved) throw new CustomError("User is already approved", 409);

    await setApprovedUserDal(id, normalizedApprovalData(user.subscriptionPlan));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createUserService = async (dto: CreateUserDto) => {
  try {
    const user = await insertUserDal(dto);
    return normalizedUser(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// export const updateUserService = async (id: string, dto: UpdateUserDto) => {
//   try {
//     const item = await updateUserByIdDal(id, dto);
//     if (!item) throw new CustomError("User not found", 404);
//     return item;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

// export const removeUserService = async (id: string) => {
//   try {
//     const deleted = await deleteUserDal(id);
//     if (!deleted) throw new CustomError("User not found", 404);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };
