import { UserRole } from "../../entities/User";

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
