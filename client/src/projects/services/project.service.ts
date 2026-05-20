import axiosInstance from "../../global/services/axios";
import type { Project, CreateProjectDto, UpdateProjectDto } from "../types/projects.types";

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await axiosInstance.get("/projects");
  return data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const { data } = await axiosInstance.get(`/projects/${id}`);
  return data;
};

export const getProjectsByClient = async (clientId: string): Promise<Project[]> => {
  const { data } = await axiosInstance.get(`/projects/client/${clientId}`);
  return data;
};

export const createProject = async (dto: CreateProjectDto): Promise<Project> => {
  const { data } = await axiosInstance.post("/projects", dto);
  return data;
};

export const updateProject = async (id: string, dto: UpdateProjectDto): Promise<Project> => {
  const { data } = await axiosInstance.put(`/projects/${id}`, dto);
  return data;
};