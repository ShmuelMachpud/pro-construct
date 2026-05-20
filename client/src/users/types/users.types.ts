export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "past_due"
  | "cancelled"
  | "pending";

export type UserRole = "admin" | "operator" | "contractor";

export interface UserInterface  {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  paymentToken: string | null;
  phone: string | null;
  companyName: string | null;
  companyId: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
};
