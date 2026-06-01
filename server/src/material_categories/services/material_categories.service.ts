import { CustomError } from "../../utils/customError";
import {
  findAllMaterialCategoriesDal,
  findMaterialCategoryByIdDal,
  insertMaterialCategoryDal,
  updateMaterialCategoryByIdDal,
  deleteMaterialCategoryDal,
} from "../dal/material_categories.dal";
import {
  CreateMaterialCategoryDto,
  UpdateMaterialCategoryDto,
} from "../types/material_categories.types";

export const getAllMaterialCategoriesService = async () => {
  try {
    return await findAllMaterialCategoriesDal();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMaterialCategoryByIdService = async (id: number) => {
  try {
    const item = await findMaterialCategoryByIdDal(id);
    if (!item) throw new CustomError("Material category not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createMaterialCategoryService = async (
  dto: CreateMaterialCategoryDto,
) => {
  try {
    return await insertMaterialCategoryDal(dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateMaterialCategoryService = async (
  id: number,
  dto: UpdateMaterialCategoryDto,
) => {
  try {
    const item = await updateMaterialCategoryByIdDal(id, dto);
    if (!item) throw new CustomError("Material category not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeMaterialCategoryService = async (id: number) => {
  try {
    const deleted = await deleteMaterialCategoryDal(id);
    if (!deleted) throw new CustomError("Material category not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
