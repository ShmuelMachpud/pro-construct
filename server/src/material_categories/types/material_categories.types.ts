export interface CreateMaterialCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateMaterialCategoryDto {
  name?: string;
  description?: string;
}
