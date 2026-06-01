import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllMaterialCategoriesService,
  getMaterialCategoryByIdService,
  createMaterialCategoryService,
  updateMaterialCategoryService,
  removeMaterialCategoryService,
} from "../services/material_categories.service";

export const getAllMaterialCategoriesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const items = await getAllMaterialCategoriesService();
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getMaterialCategoryByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const item = await getMaterialCategoryByIdService(Number(id));
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const createMaterialCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const item = await createMaterialCategoryService(req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateMaterialCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const item = await updateMaterialCategoryService(Number(id), req.body);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeMaterialCategoryController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await removeMaterialCategoryService(Number(id));
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
