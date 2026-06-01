import axiosInstance from "../../global/services/axiosServer";
import type {
  GlobalMaterial,
  CreateGlobalMaterialDto,
  UpdateGlobalMaterialDto,
} from "../types/materials.types";

export const getGlobalMaterials = async (): Promise<GlobalMaterial[]> => {
  const { data } = await axiosInstance.get("/global-materials");
  return data;
};

export const getGlobalMaterialsByCategory = async (
  categoryId: number,
): Promise<GlobalMaterial[]> => {
  const { data } = await axiosInstance.get(
    `/global-materials/category/${categoryId}`,
  );
  return data;
};

export const createGlobalMaterial = async (
  dto: CreateGlobalMaterialDto,
): Promise<GlobalMaterial> => {
  const { data } = await axiosInstance.post("/global-materials", dto);
  return data;
};

export const updateGlobalMaterial = async (
  id: number,
  dto: UpdateGlobalMaterialDto,
): Promise<GlobalMaterial> => {
  const { data } = await axiosInstance.put(`/global-materials/${id}`, dto);
  return data;
};

export const deleteGlobalMaterial = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/global-materials/${id}`);
};
