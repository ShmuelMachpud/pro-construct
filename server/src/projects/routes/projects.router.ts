import { Router } from "express";
import { createProject, getProjects, getProjectById } from "../controllers/projects.controller";
import { authenticate, authorize } from "../../shared/middleware/auth.middleware";
import { UserRole } from "../../entities/User";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get("/", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getProjects);
projectsRouter.get("/:id", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getProjectById);
projectsRouter.post("/", authorize(UserRole.CONTRACTOR), createProject);
