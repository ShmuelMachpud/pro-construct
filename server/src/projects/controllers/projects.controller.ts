import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.types";
import { createProjectService, getProjectsService, getProjectByIdService } from "../services/projects.service";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await createProjectService(req.body, req.user!.id);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await getProjectsService(req.user!.id);
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await getProjectByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
