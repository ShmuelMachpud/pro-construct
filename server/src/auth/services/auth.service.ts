import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/environments";
import { findUserByEmail, findUserById, createUser, setUserApproved, findPendingContractors } from "../dal/auth.dal";
import { RegisterDto, LoginDto } from "../types/auth.types";
import { UserRole } from "../model/user.entity";

export { RegisterDto, LoginDto };

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
    role: UserRole.CONTRACTOR,
    isApproved: false,
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

  if (user.role === UserRole.CONTRACTOR && !user.isApproved) {
    throw new Error("Account pending admin approval");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
};

export const approveUserService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role !== UserRole.CONTRACTOR) {
    throw new Error("Only contractor accounts require approval");
  }
  if (user.isApproved) {
    throw new Error("User is already approved");
  }

  const approved = await setUserApproved(userId);
  const { password, ...userWithoutPassword } = approved;
  return userWithoutPassword;
};

export const getPendingContractorsService = async () => {
  const users = await findPendingContractors();
  return users.map(({ password, ...u }) => u);
};
