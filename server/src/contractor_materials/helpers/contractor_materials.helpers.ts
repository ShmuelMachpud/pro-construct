import { ContractorMaterial } from "../model/contractor_material.entity";

export const isDuplicateContractorMaterial = (
  existing: ContractorMaterial | null,
): boolean => existing !== null;
