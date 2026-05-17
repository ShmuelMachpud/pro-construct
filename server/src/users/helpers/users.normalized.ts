import { User } from "../model/user.entity";
import { UserForClient } from "../types/users.types";

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
});

export const normalizedUsers = (users: User[]) => {
  const normalizeUsers: UserForClient[] = users.map((user) =>
    normalizedUser(user),
  );
  return normalizeUsers;
};
