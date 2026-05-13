import axiosInstance from "../../global/services/axios";
import type { User, PendingUser } from "../types/users.types";

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  const response = await axiosInstance.get("/auth/pending");
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/auth/users");
  return response.data;
};

export const approveUser = async (userId: string): Promise<void> => {
  await axiosInstance.patch(`/auth/users/${userId}/approve`);
};
