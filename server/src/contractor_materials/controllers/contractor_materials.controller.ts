import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllContractorMaterialsService,
  getContractorMaterialByIdService,
  addContractorMaterialService,
  updateContractorMaterialService,
  removeContractorMaterialService,
} from "../services/contractor_materials.service";

export const getContractorMaterialsByContractorController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { contractorId } = req.params;
    const items = await getAllContractorMaterialsService(contractorId as string);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllContractorMaterialsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const items = await getAllContractorMaterialsService(contractorId);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getContractorMaterialByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const { id } = req.params;
    const item = await getContractorMaterialByIdService(
      Number(id),
      contractorId,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const addContractorMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const item = await addContractorMaterialService(contractorId, req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateContractorMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const { id } = req.params;
    const item = await updateContractorMaterialService(
      Number(id),
      contractorId,
      req.body,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeContractorMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const { id } = req.params;
    await removeContractorMaterialService(Number(id), contractorId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
