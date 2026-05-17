import axiosInstance from "../../global/services/axios";
import type { User, PendingUser } from "../types/users.types";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  const response = await axiosInstance.get("/users/pending");
  return response.data;
};

export const approveUser = async (userId: string): Promise<void> => {
  await axiosInstance.patch(`/users/${userId}/approve`);
};
