import { AppDataSource } from "../../config/database";
import { GlobalMaterial } from "../model/global_material.entity";
import {
  CreateGlobalMaterialDto,
  UpdateGlobalMaterialDto,
} from "../types/global_materials.types";

const repository = AppDataSource.getRepository(GlobalMaterial);

const WITH_CATEGORY = { relations: { category: true } };

export const findAllGlobalMaterialsDal = async () => {
  return await repository.find({ ...WITH_CATEGORY, order: { name: "ASC" } });
};

export const findGlobalMaterialsByCategoryDal = async (categoryId: number) => {
  return await repository.find({
    ...WITH_CATEGORY,
    where: { categoryId },
    order: { name: "ASC" },
  });
};

export const findGlobalMaterialByIdDal = async (id: number) => {
  return await repository.findOne({ ...WITH_CATEGORY, where: { id } });
};

export const insertGlobalMaterialDal = async (
  data: CreateGlobalMaterialDto,
) => {
  const item = repository.create(data);
  const saved = await repository.save(item);
  return await repository.findOne({ ...WITH_CATEGORY, where: { id: saved.id } });
};

export const updateGlobalMaterialByIdDal = async (
  id: number,
  data: UpdateGlobalMaterialDto,
) => {
  await repository.update(id, data);
  return await repository.findOne({ ...WITH_CATEGORY, where: { id } });
};

export const deleteGlobalMaterialDal = async (id: number) => {
  const result = await repository.delete(id);
  return (result.affected ?? 0) > 0;
};
