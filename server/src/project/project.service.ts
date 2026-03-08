import { Project } from "../entities/Project";
import { createProject, getProjectsByContractor, getProjectById } from "./project.dal";
import { createClient, getClientById } from "../client/client.dal";

export interface CreateProjectDto {
  name: string;
  type: string;
  city: string;
  address?: string;
  budget?: number;
  permitStatus?: string;
  siteManagerId?: number;
  clientId?: number;
  newClient?: {
    name: string;
    type: string;
    phone: string;
    email?: string;
    address?: string;
    idNumber?: string;
    notes?: string;
  };
}

export const createProjectService = async (dto: CreateProjectDto, contractorId: number): Promise<Project> => {
  let clientId = dto.clientId;

  if (!clientId && dto.newClient) {
    const client = await createClient({
      ...dto.newClient,
      contractorId,
    } as any);
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