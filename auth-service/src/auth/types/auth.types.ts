import { SubscriptionPlan } from "../../users/types/users.types";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  plan: SubscriptionPlan;
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
