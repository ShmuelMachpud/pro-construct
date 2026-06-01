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
