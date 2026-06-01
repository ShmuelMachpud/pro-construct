import { CustomError } from "../../utils/customError";
import { getProjectByIdAndContractorService } from "../../projects/services/projects.service";
import { getContractorMaterialByIdService } from "../../contractor_materials/services/contractor_materials.service";
import {
  findAllProjectMaterialsDal,
  findProjectMaterialByIdDal,
  findProjectMaterialByContractorMaterialDal,
  insertProjectMaterialDal,
  updateProjectMaterialByIdDal,
  deleteProjectMaterialDal,
} from "../dal/project_materials.dal";
import { isDuplicateProjectMaterial } from "../helpers/project_materials.helpers";
import {
  AddProjectMaterialDto,
  UpdateProjectMaterialDto,
} from "../types/project_materials.types";

export const getAllProjectMaterialsService = async (
  projectId: string,
  contractorId: string,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    return await findAllProjectMaterialsDal(projectId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectMaterialByIdService = async (
  id: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const item = await findProjectMaterialByIdDal(id, projectId);
    if (!item) throw new CustomError("Project material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addProjectMaterialService = async (
  projectId: string,
  contractorId: string,
  dto: AddProjectMaterialDto,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    await getContractorMaterialByIdService(dto.contractorMaterialId, contractorId);
    const existing = await findProjectMaterialByContractorMaterialDal(
      projectId,
      dto.contractorMaterialId,
    );
    if (isDuplicateProjectMaterial(existing))
      throw new CustomError("Material already added to this project", 409);
    return await insertProjectMaterialDal(projectId, dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProjectMaterialService = async (
  id: number,
  projectId: string,
  contractorId: string,
  dto: UpdateProjectMaterialDto,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const item = await updateProjectMaterialByIdDal(id, projectId, dto);
    if (!item) throw new CustomError("Project material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeProjectMaterialService = async (
  id: number,
  projectId: string,
  contractorId: string,
) => {
  try {
    await getProjectByIdAndContractorService(projectId, contractorId);
    const deleted = await deleteProjectMaterialDal(id, projectId);
    if (!deleted) throw new CustomError("Project material not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
