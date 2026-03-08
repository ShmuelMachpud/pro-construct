import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/environments";
import { UserRole } from "../entities/User";
import { findUserByEmail, createUser } from "./auth.dal";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  contractorId?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const registerService = async (dto: RegisterDto) => {
  const existing = await findUserByEmail(dto.email);
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await createUser({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: dto.role,
    contractorId: dto.contractorId ?? undefined,
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginService = async (dto: LoginDto) => {
  const user = await findUserByEmail(dto.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      contractorId: user.contractorId,
    },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
};