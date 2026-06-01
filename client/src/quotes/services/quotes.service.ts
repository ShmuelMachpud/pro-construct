import axiosInstance from "../../global/services/axiosServer";
import type {
  ProjectMaterial,
  AddProjectMaterialDto,
  UpdateProjectMaterialDto,
} from "../types/quotes.types";

export const getProjectMaterials = async (
  projectId: string,
): Promise<ProjectMaterial[]> => {
  const { data } = await axiosInstance.get(`/projects/${projectId}/materials`);
  return data;
};

export const addProjectMaterial = async (
  projectId: string,
  dto: AddProjectMaterialDto,
): Promise<ProjectMaterial> => {
  const { data } = await axiosInstance.post(
    `/projects/${projectId}/materials`,
    dto,
  );
  return data;
};

export const updateProjectMaterial = async (
  projectId: string,
  id: number,
  dto: UpdateProjectMaterialDto,
): Promise<ProjectMaterial> => {
  const { data } = await axiosInstance.put(
    `/projects/${projectId}/materials/${id}`,
    dto,
  );
  return data;
};

export const deleteProjectMaterial = async (
  projectId: string,
  id: number,
): Promise<void> => {
  await axiosInstance.delete(`/projects/${projectId}/materials/${id}`);
};
