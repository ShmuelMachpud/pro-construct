import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createProjectService, getProjectsService, getProjectByIdService } from "./project.service";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const project = await createProjectService(req.body, contractorId);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const projects = await getProjectsService(contractorId);
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const contractorId = req.user!.contractorId ?? req.user!.id;
    const project = await getProjectByIdService(Number(req.params.id), contractorId);
    res.status(200).json(project);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};