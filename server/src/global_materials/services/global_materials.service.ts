import { CustomError } from "../../utils/customError";
import {
  findAllGlobalMaterialsDal,
  findGlobalMaterialsByCategoryDal,
  findGlobalMaterialByIdDal,
  insertGlobalMaterialDal,
  updateGlobalMaterialByIdDal,
  deleteGlobalMaterialDal,
} from "../dal/global_materials.dal";
import {
  CreateGlobalMaterialDto,
  UpdateGlobalMaterialDto,
} from "../types/global_materials.types";

export const getAllGlobalMaterialsService = async () => {
  try {
    return await findAllGlobalMaterialsDal();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getGlobalMaterialsByCategoryService = async (
  categoryId: number,
) => {
  try {
    return await findGlobalMaterialsByCategoryDal(categoryId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getGlobalMaterialByIdService = async (id: number) => {
  try {
    const item = await findGlobalMaterialByIdDal(id);
    if (!item) throw new CustomError("Global material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createGlobalMaterialService = async (
  dto: CreateGlobalMaterialDto,
) => {
  try {
    return await insertGlobalMaterialDal(dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateGlobalMaterialService = async (
  id: number,
  dto: UpdateGlobalMaterialDto,
) => {
  try {
    const item = await updateGlobalMaterialByIdDal(id, dto);
    if (!item) throw new CustomError("Global material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeGlobalMaterialService = async (id: number) => {
  try {
    const deleted = await deleteGlobalMaterialDal(id);
    if (!deleted) throw new CustomError("Global material not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
