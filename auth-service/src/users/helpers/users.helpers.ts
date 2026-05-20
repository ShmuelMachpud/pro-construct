import { User } from "../model/users.entity";
import {
  SetApprovalData,
  SubscriptionPlan,
  SubscriptionStatus,
  UserForClient,
} from "../types/users.types";

export const calcSubscriptionEndDate = (
  plan: SubscriptionPlan,
  from: Date,
): Date => {
  const end = new Date(from);
  end.setMonth(end.getMonth() + (plan === SubscriptionPlan.ANNUAL ? 12 : 1));
  return end;
};

export const normalizedApprovalData = (
  plan: SubscriptionPlan,
): SetApprovalData => {
  const now = new Date();
  return {
    isApproved: true,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    subscriptionStartDate: now,
    subscriptionEndDate: calcSubscriptionEndDate(plan, now),
  };
};

export const normalizedUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isApproved: user.isApproved,
  subscriptionStatus: user.subscriptionStatus,
  phone: user.phone,
  companyName: user.companyName,
  companyId: user.companyId,
  address: user.address,
  createdAt: user.createdAt,
});

export const normalizedUsers = (users: User[]) => {
  const normalizeUsers: UserForClient[] = users.map((user) =>
    normalizedUser(user),
  );
  return normalizeUsers;
};
