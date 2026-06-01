export interface AddProjectMaterialDto {
  contractorMaterialId: number;
  quantity: number;
  notes?: string;
}

export interface UpdateProjectMaterialDto {
  quantity?: number;
  notes?: string;
}
