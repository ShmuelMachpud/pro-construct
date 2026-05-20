import axiosInstance from "../../global/services/axiosAuthService";
import type { UserInterface } from "../types/users.types";

export const getAllUsers = async (): Promise<UserInterface[]> => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getPendingUsers = async (): Promise<UserInterface[]> => {
  const response = await axiosInstance.get("/users/pending");
  return response.data;
};

export const approveUser = async (userId: string): Promise<void> => {
  await axiosInstance.patch(`/users/${userId}/approve`);
};
