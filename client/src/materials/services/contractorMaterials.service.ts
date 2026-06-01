import axiosInstance from "../../global/services/axiosServer";
import type {
  ContractorMaterial,
  AddContractorMaterialDto,
  UpdateContractorMaterialDto,
} from "../types/materials.types";

export const getContractorMaterials = async (): Promise<ContractorMaterial[]> => {
  const { data } = await axiosInstance.get("/contractor-materials");
  return data;
};

export const addContractorMaterial = async (
  dto: AddContractorMaterialDto,
): Promise<ContractorMaterial> => {
  const { data } = await axiosInstance.post("/contractor-materials", dto);
  return data;
};

export const updateContractorMaterial = async (
  id: number,
  dto: UpdateContractorMaterialDto,
): Promise<ContractorMaterial> => {
  const { data } = await axiosInstance.put(`/contractor-materials/${id}`, dto);
  return data;
};

export const deleteContractorMaterial = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/contractor-materials/${id}`);
};
