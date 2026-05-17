export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "trial"
  | "past_due"
  | "cancelled";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
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

export type PendingUser = User;
