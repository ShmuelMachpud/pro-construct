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

  // cardNumber: string,
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
    mockCardNumber: subscriptionId,
    // mockCardNumber: cardNumber,
  });
  return response.data;
};
