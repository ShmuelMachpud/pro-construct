import { Project } from "../../entities/Project";
import { createProject, getProjectsByContractor, getProjectById } from "../dal/projects.dal";
import { createClientService } from "../../clients/services/clients.service";
import { CreateProjectDto } from "../types/projects.types";

export { CreateProjectDto };

export const createProjectService = async (dto: CreateProjectDto, contractorId: number): Promise<Project> => {
  let clientId = dto.clientId;

  if (!clientId && dto.newClient) {
    const client = await createClientService(dto.newClient, contractorId);
    clientId = client.id;
  }

  if (!clientId) {
    throw new Error("Client is required");
  }

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
};

export const getProjectsService = async (contractorId: number): Promise<Project[]> => {
  return await getProjectsByContractor(contractorId);
};

export const getProjectByIdService = async (id: number, contractorId: number): Promise<Project> => {
  const project = await getProjectById(id, contractorId);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
