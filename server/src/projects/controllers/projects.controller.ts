import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { handleError } from "../../utils/handleError";
import {
  getProjectsByContractorService,
  getProjectsByClientService,
  getProjectByIdService,
  createProjectService,
  updateProjectService,
  removeProjectService,
} from "../services/projects.service";

export const getProjectsByContractorController = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await getProjectsByContractorService(req.user!.id);
    res.status(200).json(projects);
  } catch (error) {
    handleError(error, res);
  }
};

export const getProjectsByClientController = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const projects = await getProjectsByClientService(clientId as string);
    res.status(200).json(projects);
  } catch (error) {
    handleError(error, res);
  }
};

export const getProjectByIdController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await getProjectByIdService(id as string);
    res.status(200).json(project);
  } catch (error) {
    handleError(error, res);
  }
};

export const createProjectController = async (req: AuthRequest, res: Response) => {
  try {
    const project = await createProjectService(req.body);
    res.status(201).json(project);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProjectController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await updateProjectService(id as string, req.body);
    res.status(200).json(project);
  } catch (error) {
    handleError(error, res);
  }
};

export const removeProjectController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await removeProjectService(id as string);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
