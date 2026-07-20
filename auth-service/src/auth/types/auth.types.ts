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
  // PayPal subscription id, received after the user approved the payment
  subscriptionId: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
