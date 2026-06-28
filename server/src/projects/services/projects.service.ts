import { CustomError } from "../../utils/customError";
import { CreateProjectDto, UpdateProjectDto } from "../types/projects.types";
import {
  findAllProjectsDal,
  findProjectsByContractorDal,
  findProjectsByCustomerDal,
  findProjectByIdDal,
  findProjectByIdAndContractorDal,
  insertProjectDal,
  updateProjectByIdDal,
  deleteProjectDal,
} from "../dal/projects.dal";

export const getAllProjectsService = async () => {
  try {
    return await findAllProjectsDal();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectsByContractorService = async (contractorId: string) => {
  try {
    return await findProjectsByContractorDal(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectsByCustomerService = async (customerId: string) => {
  try {
    return await findProjectsByCustomerDal(customerId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectByIdService = async (id: string) => {
  try {
    const item = await findProjectByIdDal(id);
    if (!item) throw new CustomError("Project not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectByIdAndContractorService = async (
  id: string,
  contractorId: string,
) => {
  try {
    const item = await findProjectByIdAndContractorDal(id, contractorId);
    if (!item) throw new CustomError("Project not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createProjectService = async (dto: CreateProjectDto) => {
  try {
    return await insertProjectDal(dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateProjectService = async (
  id: string,
  dto: UpdateProjectDto,
) => {
  try {
    const item = await updateProjectByIdDal(id, dto);
    if (!item) throw new CustomError("Project not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeProjectService = async (id: string) => {
  try {
    const deleted = await deleteProjectDal(id);
    if (!deleted) throw new CustomError("Project not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
