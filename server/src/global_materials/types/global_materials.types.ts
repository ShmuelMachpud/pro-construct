export interface CreateGlobalMaterialDto {
  name: string;
  categoryId: number;
  unit: string;
  description?: string;
}

export interface UpdateGlobalMaterialDto {
  name?: string;
  categoryId?: number;
  unit?: string;
  description?: string;
}
