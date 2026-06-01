import { Response } from "express";
import { handleError } from "../../utils/handleError";
import { AuthRequest } from "../../types/auth.types";
import {
  getAllProjectMaterialsService,
  getProjectMaterialByIdService,
  addProjectMaterialService,
  updateProjectMaterialService,
  removeProjectMaterialService,
} from "../services/project_materials.service";

export const getAllProjectMaterialsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const items = await getAllProjectMaterialsService(projectId, contractorId);
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const getProjectMaterialByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const id = req.params.id as string;
    const item = await getProjectMaterialByIdService(
      Number(id),
      projectId,
      contractorId,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const addProjectMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const item = await addProjectMaterialService(projectId, contractorId, req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProjectMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const id = req.params.id as string;
    const item = await updateProjectMaterialService(
      Number(id),
      projectId,
      contractorId,
      req.body,
    );
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeProjectMaterialController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const contractorId = req.user!.id;
    const projectId = req.params.projectId as string;
    const id = req.params.id as string;
    await removeProjectMaterialService(Number(id), projectId, contractorId);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
