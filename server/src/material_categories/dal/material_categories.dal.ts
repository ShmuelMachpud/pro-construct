import { AppDataSource } from "../../config/database";
import { MaterialCategory } from "../model/material_category.entity";
import {
  CreateMaterialCategoryDto,
  UpdateMaterialCategoryDto,
} from "../types/material_categories.types";

const repository = AppDataSource.getRepository(MaterialCategory);

export const findAllMaterialCategoriesDal = async () => {
  return await repository.find({ order: { name: "ASC" } });
};

export const findMaterialCategoryByIdDal = async (id: number) => {
  return await repository.findOne({ where: { id } });
};

export const insertMaterialCategoryDal = async (
  data: CreateMaterialCategoryDto,
) => {
  const item = repository.create(data);
  return await repository.save(item);
};

export const updateMaterialCategoryByIdDal = async (
  id: number,
  data: UpdateMaterialCategoryDto,
) => {
  await repository.update(id, data);
  return await repository.findOne({ where: { id } });
};

export const deleteMaterialCategoryDal = async (id: number) => {
  const result = await repository.delete(id);
  return (result.affected ?? 0) > 0;
};
