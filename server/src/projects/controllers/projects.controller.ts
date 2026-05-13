import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.types";
import { createProjectService, getProjectsService, getProjectByIdService } from "../services/projects.service";
import { handleError } from "../../utils/handleError";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await createProjectService(req.body, req.user!.id);
    res.status(201).json(project);
  } catch (error) {
    handleError(error, res);
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await getProjectsService(req.user!.id);
    res.status(200).json(projects);
  } catch (error) {
    handleError(error, res);
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await getProjectByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json(project);
  } catch (error) {
    handleError(error, res);
  }
};
