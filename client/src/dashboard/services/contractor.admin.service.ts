import axiosServer from "../../global/services/axiosServer";
import type { Project } from "../../projects/types/projects.types";
import type { Client } from "../../clients/types/clients.types";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { PriceQuoteWithProject } from "../../quotes/types/quotes.types";

export const getContractorProjects = async (contractorId: string): Promise<Project[]> => {
  const response = await axiosServer.get<Project[]>(`/projects/contractor/${contractorId}`);
  return response.data;
};

export const getContractorClients = async (contractorId: string): Promise<Client[]> => {
  const response = await axiosServer.get<Client[]>(`/clients/contractor/${contractorId}`);
  return response.data;
};

export const getContractorMaterials = async (contractorId: string): Promise<ContractorMaterial[]> => {
  const response = await axiosServer.get<ContractorMaterial[]>(`/contractor-materials/contractor/${contractorId}`);
  return response.data;
};

export const getContractorQuotes = async (contractorId: string): Promise<PriceQuoteWithProject[]> => {
  const response = await axiosServer.get<PriceQuoteWithProject[]>(`/quotes/contractor/${contractorId}`);
  return response.data;
};
