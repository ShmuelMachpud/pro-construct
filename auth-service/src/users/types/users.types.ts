import { User } from "../model/users.entity";

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
  CONTRACTOR = "contractor",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PAST_DUE = "past_due",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

export enum SubscriptionPlan {
  MONTHLY = "monthly",
  ANNUAL = "annual",
}

export interface UserForClient extends Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "role"
  | "isApproved"
  | "subscriptionStatus"
  | "phone"
  | "companyName"
  | "companyId"
  | "address"
> {}
export interface CreateUserDto extends Pick<
  User,
  | "name"
  | "email"
  | "password"
  | "role"
  | "isApproved"
  | "subscriptionStatus"
  | "subscriptionPlan"
  | "phone"
  | "companyName"
  | "companyId"
  | "address"
  | "paymentToken"
> {}
export interface UpdateUserDto {}

export interface SetApprovalData {
  isApproved: boolean;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
}
