import { AppDataSource } from "../../config/database";
import { ContractorMaterial } from "../model/contractor_material.entity";
import {
  AddContractorMaterialDto,
  UpdateContractorMaterialDto,
} from "../types/contractor_materials.types";

const repository = AppDataSource.getRepository(ContractorMaterial);

// Every read eager-loads the linked global material AND its category,
// so the client receives one self-contained object per row
// (contractor price + global name/unit + category name) in a single query
const WITH_MATERIAL = { relations: { globalMaterial: { category: true } } };

export const findAllContractorMaterialsDal = async (contractorId: string) => {
  return await repository.find({
    ...WITH_MATERIAL,
    where: { contractorId }, // hard scoping - only this contractor's rows
    order: { createdAt: "DESC" },
  });
};

export const insertContractorMaterialDal = async (
  contractorId: string,
  dto: AddContractorMaterialDto,
) => {
  const item = repository.create({ contractorId, ...dto });
  const saved = await repository.save(item);

  // Re-fetch with relations so the API response includes the joined data
  return await repository.findOne({
    ...WITH_MATERIAL,
    where: { id: saved.id },
  });
};

export const findContractorMaterialByIdDal = async (
  id: number,
  contractorId: string,
) => {
  return await repository.findOne({
    ...WITH_MATERIAL,
    where: { id, contractorId },
  });
};

export const findContractorMaterialByGlobalIdDal = async (
  globalMaterialId: number,
  contractorId: string,
) => {
  return await repository.findOne({
    where: { globalMaterialId, contractorId },
  });
};

export const updateContractorMaterialByIdDal = async (
  id: number,
  contractorId: string,
  dto: UpdateContractorMaterialDto,
) => {
  await repository.update({ id, contractorId }, dto);
  return await repository.findOne({
    ...WITH_MATERIAL,
    where: { id, contractorId },
  });
};

export const deleteContractorMaterialDal = async (
  id: number,
  contractorId: string,
) => {
  const result = await repository.delete({ id, contractorId });
  return (result.affected ?? 0) > 0;
};
