import axiosInstance from "../../global/services/axiosAuthService";
import type { RegisterFormType, RegisterPlan } from "../types/auth.types";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (
  values: RegisterFormType,
  plan: RegisterPlan,
  subscriptionId: string,
) => {
  const response = await axiosInstance.post("/auth/register", {
    name: values.name,
    email: values.email,
    password: values.password,
    plan,
    phone: values.phone || undefined,
    companyName: values.companyName || undefined,
    companyId: values.companyId || undefined,
    address: values.address || undefined,
    subscriptionId,
  });
  return response.data;
};

// Pre-payment check so the user never pays for an email that is already taken
export const checkEmailAvailable = async (email: string): Promise<boolean> => {
  const response = await axiosInstance.post("/auth/check-email", { email });
  return response.data.available;
};
