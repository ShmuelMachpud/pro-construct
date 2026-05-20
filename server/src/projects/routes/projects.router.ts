import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getProjectsByContractorController,
  getProjectsByClientController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  removeProjectController,
} from "../controllers/projects.controller";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get("/", getProjectsByContractorController);
projectsRouter.get("/client/:clientId", getProjectsByClientController);
projectsRouter.get("/:id", getProjectByIdController);
projectsRouter.post("/", createProjectController);
projectsRouter.put("/:id", updateProjectController);
projectsRouter.delete("/:id", removeProjectController);
