import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/environment";
import {
  CreateUserDto,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from "../../users/types/users.types";
import { CustomError } from "../../utils/customError";
import { LoginDto, RegisterDto } from "../types/auth.types";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails are stored lowercased so uniqueness checks and login
// are case-insensitive
export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const validateRegisterDto = (dto: RegisterDto): void => {
  if (!dto.name?.trim()) throw new CustomError("Name is required", 400);
  if (!dto.email || !EMAIL_REGEX.test(dto.email.trim()))
    throw new CustomError("Invalid email address", 400);
  if (!dto.password || dto.password.length < MIN_PASSWORD_LENGTH)
    throw new CustomError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      400,
    );
  if (!Object.values(SubscriptionPlan).includes(dto.plan))
    throw new CustomError("Invalid subscription plan", 400);
  if (!dto.subscriptionId?.trim())
    throw new CustomError("Subscription id is required", 400);
};

export const validateLoginDto = (dto: LoginDto): void => {
  if (!dto.email?.trim() || !dto.password)
    throw new CustomError("Email and password are required", 400);
};

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
    name: dto.name.trim(),
    email: normalizeEmail(dto.email),
    password: hashedPassword,
    role: UserRole.CONTRACTOR,
    isApproved: false,
    subscriptionStatus: SubscriptionStatus.PENDING,
    subscriptionPlan: dto.plan,
    phone: dto.phone ?? null,
    companyName: dto.companyName ?? null,
    companyId: dto.companyId ?? null,
    address: dto.address ?? null,
    // The approved PayPal subscription id — the link between this
    // user and their real subscription on PayPal's side
    paymentToken: dto.subscriptionId,
  };
};
