import type { Project } from "../../projects/types/projects.types";
import type { ContractorMaterial } from "../../materials/types/materials.types";

export interface ProjectMaterial {
  id: number;
  projectId: string;
  contractorMaterialId: number;
  contractorMaterial: ContractorMaterial;
  quantity: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddProjectMaterialDto {
  contractorMaterialId: number;
  quantity: number;
  notes?: string;
}

export interface UpdateProjectMaterialDto {
  quantity?: number;
  notes?: string;
}

export interface ProjectWithTotal extends Project {
  total: number;
}
