import { User } from "../model/user.entity";

// export interface UpdateUserDto {
//   name?: string;
//   phone?: string;
//   companyName?: string;
//   companyId?: string;
//   address?: string;
// }

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
