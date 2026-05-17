export type RegisterPlan = "monthly" | "annual";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  plan: RegisterPlan;
  phone?: string;
  companyName?: string;
  companyId?: string;
  address?: string;
  mockCardNumber: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
