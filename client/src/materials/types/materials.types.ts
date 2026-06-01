export interface MaterialCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalMaterial {
  id: number;
  name: string;
  categoryId: number;
  category: MaterialCategory;
  unit: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

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

export interface ContractorMaterial {
  id: number;
  contractorId: string;
  globalMaterialId: number;
  globalMaterial: GlobalMaterial;
  price: number | null;
  supplier: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddContractorMaterialDto {
  globalMaterialId: number;
  price?: number;
  supplier?: string;
  notes?: string;
}

export interface UpdateContractorMaterialDto {
  price?: number;
  supplier?: string;
  notes?: string;
}
