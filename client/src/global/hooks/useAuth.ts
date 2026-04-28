import { useMemo } from "react";

export type UserRole = "contractor" | "site_manager" | "super_admin";

interface AuthPayload {
  id: number;
  role: UserRole;
  contractorId: number | null;
}

const decodeToken = (token: string): AuthPayload | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as AuthPayload;
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    return decodeToken(token);
  }, [token]);

  const isContractor = user?.role === "contractor";
  const isSiteManager = user?.role === "site_manager";

  return { user, isContractor, isSiteManager };
};
