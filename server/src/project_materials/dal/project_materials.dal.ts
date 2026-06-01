import { AppDataSource } from "../../config/database";
import { ProjectMaterial } from "../model/project_material.entity";
import {
  AddProjectMaterialDto,
  UpdateProjectMaterialDto,
} from "../types/project_materials.types";

const repository = AppDataSource.getRepository(ProjectMaterial);

export const findAllProjectMaterialsDal = async (projectId: string) => {
  return await repository.find({
    where: { projectId },
    order: { createdAt: "ASC" },
  });
};

export const findProjectMaterialByIdDal = async (
  id: number,
  projectId: string,
) => {
  return await repository.findOne({ where: { id, projectId } });
};

export const findProjectMaterialByContractorMaterialDal = async (
  projectId: string,
  contractorMaterialId: number,
) => {
  return await repository.findOne({ where: { projectId, contractorMaterialId } });
};

export const insertProjectMaterialDal = async (
  projectId: string,
  dto: AddProjectMaterialDto,
) => {
  const item = repository.create({ projectId, ...dto });
  const saved = await repository.save(item);
  return await repository.findOne({ where: { id: saved.id } });
};

export const updateProjectMaterialByIdDal = async (
  id: number,
  projectId: string,
  dto: UpdateProjectMaterialDto,
) => {
  await repository.update({ id, projectId }, dto);
  return await repository.findOne({ where: { id, projectId } });
};

export const deleteProjectMaterialDal = async (
  id: number,
  projectId: string,
) => {
  const result = await repository.delete({ id, projectId });
  return (result.affected ?? 0) > 0;
};
