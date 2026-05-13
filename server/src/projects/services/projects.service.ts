import { Project } from "../model/project.entity";
import { createProject, getProjectsByContractor, getProjectById } from "../dal/projects.dal";
import { createClientService } from "../../clients/services/clients.service";
import { CreateProjectDto } from "../types/projects.types";
import { CustomError } from "../../utils/customError";

export { CreateProjectDto };

export const createProjectService = async (dto: CreateProjectDto, contractorId: string): Promise<Project> => {
  try {
    let clientId = dto.clientId;

    if (!clientId && dto.newClient) {
      const client = await createClientService(dto.newClient, contractorId);
      clientId = client.id;
    }

    if (!clientId) throw new CustomError("Client is required", 400);

    return await createProject({
      name: dto.name,
      type: dto.type as any,
      city: dto.city,
      address: dto.address,
      budget: dto.budget,
      permitStatus: dto.permitStatus as any,
      clientId,
      contractorId,
      siteManagerId: dto.siteManagerId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectsService = async (contractorId: string): Promise<Project[]> => {
  try {
    return await getProjectsByContractor(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getProjectByIdService = async (id: number, contractorId: string): Promise<Project> => {
  try {
    const project = await getProjectById(id, contractorId);
    if (!project) throw new CustomError("Project not found", 404);
    return project;
  } catch (error) {
    return Promise.reject(error);
  }
};
