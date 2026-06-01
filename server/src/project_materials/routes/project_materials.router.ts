import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getAllProjectMaterialsController,
  getProjectMaterialByIdController,
  addProjectMaterialController,
  updateProjectMaterialController,
  removeProjectMaterialController,
} from "../controllers/project_materials.controller";

export const projectMaterialsRouter = Router({ mergeParams: true });

projectMaterialsRouter.use(authenticate);

projectMaterialsRouter.get("/", getAllProjectMaterialsController);
projectMaterialsRouter.get("/:id", getProjectMaterialByIdController);
projectMaterialsRouter.post("/", addProjectMaterialController);
projectMaterialsRouter.put("/:id", updateProjectMaterialController);
projectMaterialsRouter.delete("/:id", removeProjectMaterialController);
