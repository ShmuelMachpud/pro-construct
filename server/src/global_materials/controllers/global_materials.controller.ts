import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllGlobalMaterialsService,
  getGlobalMaterialsByCategoryService,
  getGlobalMaterialByIdService,
  createGlobalMaterialService,
  updateGlobalMaterialService,
  removeGlobalMaterialService,
} from "../services/global_materials.service";

export const getAllGlobalMaterialsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const items = await getAllGlobalMaterialsService();
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getGlobalMaterialsByCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { categoryId } = req.params;
    const items = await getGlobalMaterialsByCategoryService(Number(categoryId));
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getGlobalMaterialByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const item = await getGlobalMaterialByIdService(Number(id));
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const createGlobalMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const item = await createGlobalMaterialService(req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateGlobalMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const item = await updateGlobalMaterialService(Number(id), req.body);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeGlobalMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await removeGlobalMaterialService(Number(id));
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
