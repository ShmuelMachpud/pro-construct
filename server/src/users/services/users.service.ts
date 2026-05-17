import { UserRole, SubscriptionStatus } from "../model/user.entity";
import { CustomError } from "../../utils/customError";
// import { UpdateUserDto } from "../types/users.types";
import {
  findAllUsers,
  findUserById,
  findPendingContractors,
  setUserApproved,
  // updateUser,
} from "../dal/users.dal";
import { normalizedUser, normalizedUsers } from "../helpers/users.normalized";

export const getAllUsersService = async () => {
  try {
    const users = await findAllUsers();
    const normalizeUsers = normalizedUsers(users);
    return normalizeUsers;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserByIdService = async (id: string) => {
  try {
    const user = await findUserById(id);
    if (!user) throw new CustomError("User not found", 404);
    const normalizeUser = normalizedUser(user);
    return normalizeUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPendingContractorsService = async () => {
  try {
    const users = await findPendingContractors();
    const normalizeUsers = normalizedUsers(users);
    return normalizeUsers;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const approveUserService = async (id: string) => {
  try {
    const user = await findUserById(id);
    if (!user) throw new CustomError("User not found", 404);
    if (user.role !== UserRole.CONTRACTOR)
      throw new CustomError("Only contractor accounts require approval", 400);
    if (user.isApproved) throw new CustomError("User is already approved", 409);

    const now = new Date();
    const nowMonth = now.getMonth();
    const endDate = now.setMonth(
      user.subscriptionPlan === "annual" ? nowMonth + 12 : nowMonth + 1,
    );

    const approved = await setUserApproved(id, {
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(endDate),
    });

    return approved;
  } catch (error) {
    return Promise.reject(error);
  }
};

// export const updateUserService = async (id: string, dto: UpdateUserDto) => {
//   try {
//     const user = await findUserById(id);
//     if (!user) throw new CustomError("User not found", 404);

//     const updated = await updateUser(id, dto);
//     const normalizeupdated = normalizedUser(updated);
//     return normalizeupdated;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };
