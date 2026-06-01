import axiosInstance from "../../global/services/axiosServer";
import type {
  MaterialCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/materials.types";

export const getCategories = async (): Promise<MaterialCategory[]> => {
  const { data } = await axiosInstance.get("/material-categories");
  return data;
};

export const createCategory = async (
  dto: CreateCategoryDto,
): Promise<MaterialCategory> => {
  const { data } = await axiosInstance.post("/material-categories", dto);
  return data;
};

export const updateCategory = async (
  id: number,
  dto: UpdateCategoryDto,
): Promise<MaterialCategory> => {
  const { data } = await axiosInstance.put(`/material-categories/${id}`, dto);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/material-categories/${id}`);
};
