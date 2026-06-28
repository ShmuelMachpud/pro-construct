import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";
import {
  getAllProjectsController,
  getProjectsByContractorAdminController,
  getProjectsByContractorController,
  getProjectsByCustomerController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  removeProjectController,
} from "../controllers/projects.controller";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get(
  "/all",
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getAllProjectsController,
);
projectsRouter.get(
  "/contractor/:contractorId",
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getProjectsByContractorAdminController,
);
projectsRouter.get("/", getProjectsByContractorController);
projectsRouter.get("/customer/:customerId", getProjectsByCustomerController);
projectsRouter.get("/:id", getProjectByIdController);
projectsRouter.post(
  "/",
  authorize(UserRole.CONTRACTOR),
  createProjectController,
);
projectsRouter.put(
  "/:id",
  authorize(UserRole.CONTRACTOR),
  updateProjectController,
);
projectsRouter.delete(
  "/:id",
  authorize(UserRole.CONTRACTOR),
  removeProjectController,
);
