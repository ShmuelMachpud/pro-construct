import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/environments";
import { findUserByEmail, createUser } from "../dal/auth.dal";
import { RegisterDto, LoginDto } from "../types/auth.types";
import { UserRole } from "../../users/model/user.entity";
import { CustomError } from "../../utils/customError";

export { RegisterDto, LoginDto };

export const registerService = async (dto: RegisterDto) => {
  try {
    const existing = await findUserByEmail(dto.email);
    if (existing) throw new CustomError("Email already exists", 409);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CONTRACTOR,
      isApproved: false,
      subscriptionPlan: dto.plan,
      phone: dto.phone ?? null,
      companyName: dto.companyName ?? null,
      companyId: dto.companyId ?? null,
      address: dto.address ?? null,
      paymentToken: `mock_tok_${dto.email}_${Date.now()}`
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loginService = async (dto: LoginDto) => {
  try {
    const user = await findUserByEmail(dto.email);
    if (!user) throw new CustomError("Invalid credentials", 401);

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new CustomError("Invalid credentials", 401);

    if (user.role === UserRole.CONTRACTOR && !user.isApproved) throw new CustomError("Account pending admin approval", 403);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token };
  } catch (error) {
    return Promise.reject(error);
  }
};
