import {
  createUserService,
  getUserByEmailService,
} from "../../users/services/users.service";
import { UserRole } from "../../users/types/users.types";
import { CustomError } from "../../utils/customError";
import {
  comparePassword,
  generateToken,
  normalizedUserForInsert,
} from "../helpers/auth.helpers";
import { LoginDto, RegisterDto } from "../types/auth.types";

export const registerService = async (dto: RegisterDto) => {
  try {
    const existing = await getUserByEmailService(dto.email);
    if (existing) throw new CustomError("Email already exists", 409);

    const normalizeUser = await normalizedUserForInsert(dto);
    const savedUser = await createUserService(normalizeUser);

    return savedUser;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loginService = async (dto: LoginDto) => {
  try {
    const user = await getUserByEmailService(dto.email);
    if (!user) throw new CustomError("Invalid credentials", 401);
    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new CustomError("Invalid credentials", 401);

    if (user.role === UserRole.CONTRACTOR && !user.isApproved)
      throw new CustomError("Account pending admin approval", 403);

    const token = generateToken(user.id, user.role);

    return { token };
  } catch (error) {
    return Promise.reject(error);
  }
};
