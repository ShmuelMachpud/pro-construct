import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";
import {
  getAllProjectsController,
  getProjectsByContractorController,
  getProjectsByClientController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  removeProjectController,
} from "../controllers/projects.controller";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get("/all", authorize(UserRole.ADMIN, UserRole.OPERATOR), getAllProjectsController);
projectsRouter.get("/", getProjectsByContractorController);
projectsRouter.get("/client/:clientId", getProjectsByClientController);
projectsRouter.get("/:id", getProjectByIdController);
projectsRouter.post("/", createProjectController);
projectsRouter.put("/:id", updateProjectController);
projectsRouter.delete("/:id", removeProjectController);
