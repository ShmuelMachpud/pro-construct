import axiosServer from "../../global/services/axiosServer";
import axiosAuth from "../../global/services/axiosAuthService";
import type { UserInterface } from "../../users/types/users.types";
import type { Project } from "../../projects/types/projects.types";

export const getAllContractors = async (): Promise<UserInterface[]> => {
  const response = await axiosAuth.get<UserInterface[]>("/users");
  return response.data.filter((u) => u.role === "contractor");
};

export const getContractorById = async (id: string): Promise<UserInterface> => {
  const response = await axiosAuth.get<UserInterface>(`/users/${id}`);
  return response.data;
};

export const getAllProjectsAdmin = async (): Promise<Project[]> => {
  const response = await axiosServer.get<Project[]>("/projects/all");
  return response.data;
};
