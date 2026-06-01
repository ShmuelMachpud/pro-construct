import { CustomError } from "../../utils/customError";
import {
  findAllContractorMaterialsDal,
  findContractorMaterialByIdDal,
  findContractorMaterialByGlobalIdDal,
  insertContractorMaterialDal,
  updateContractorMaterialByIdDal,
  deleteContractorMaterialDal,
} from "../dal/contractor_materials.dal";
import { isDuplicateContractorMaterial } from "../helpers/contractor_materials.helpers";
import {
  AddContractorMaterialDto,
  UpdateContractorMaterialDto,
} from "../types/contractor_materials.types";

export const getAllContractorMaterialsService = async (
  contractorId: string,
) => {
  try {
    return await findAllContractorMaterialsDal(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getContractorMaterialByIdService = async (
  id: number,
  contractorId: string,
) => {
  try {
    const item = await findContractorMaterialByIdDal(id, contractorId);
    if (!item) throw new CustomError("Contractor material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addContractorMaterialService = async (
  contractorId: string,
  dto: AddContractorMaterialDto,
) => {
  try {
    const existing = await findContractorMaterialByGlobalIdDal(
      dto.globalMaterialId,
      contractorId,
    );
    if (isDuplicateContractorMaterial(existing))
      throw new CustomError("Material already added to your list", 409);
    return await insertContractorMaterialDal(contractorId, dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateContractorMaterialService = async (
  id: number,
  contractorId: string,
  dto: UpdateContractorMaterialDto,
) => {
  try {
    const item = await updateContractorMaterialByIdDal(id, contractorId, dto);
    if (!item) throw new CustomError("Contractor material not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeContractorMaterialService = async (
  id: number,
  contractorId: string,
) => {
  try {
    const deleted = await deleteContractorMaterialDal(id, contractorId);
    if (!deleted) throw new CustomError("Contractor material not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
