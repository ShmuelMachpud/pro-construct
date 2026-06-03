import { useMemo } from "react";

export type UserRole = "admin" | "operator" | "contractor";

interface AuthPayload {
  id: number;
  role: UserRole;
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

  return {
    user,
    isAdmin: user?.role === "admin",
    isOperator: user?.role === "operator",
    isContractor: user?.role === "contractor",
  };
};
