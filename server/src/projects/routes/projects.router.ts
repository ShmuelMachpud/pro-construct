import { Router } from "express";
import { createProject, getProjects, getProjectById } from "../controllers/projects.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../auth/model/user.entity";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get("/", authorize(UserRole.CONTRACTOR, UserRole.OPERATOR), getProjects);
projectsRouter.get("/:id", authorize(UserRole.CONTRACTOR, UserRole.OPERATOR), getProjectById);
projectsRouter.post("/", authorize(UserRole.CONTRACTOR), createProject);
