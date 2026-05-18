import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/environment";
import {
  CreateUserDto,
  SubscriptionStatus,
  UserRole,
} from "../../users/types/users.types";
import { RegisterDto } from "../types/auth.types";

const SALT_ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = (
  password: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(password, hash);

export const generateToken = (id: string, role: UserRole): string =>
  jwt.sign({ id, role }, ENV.JWT_SECRET, { expiresIn: "7d" });

export const normalizedUserForInsert = async (
  dto: RegisterDto,
): Promise<CreateUserDto> => {
  const hashedPassword = await hashPassword(dto.password);
  return {
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: UserRole.CONTRACTOR,
    isApproved: false,
    subscriptionStatus: SubscriptionStatus.PENDING,
    subscriptionPlan: dto.plan,
    phone: dto.phone ?? null,
    companyName: dto.companyName ?? null,
    companyId: dto.companyId ?? null,
    address: dto.address ?? null,
    paymentToken: `mock_tok_${dto.email}_${Date.now()}`,
  };
};
