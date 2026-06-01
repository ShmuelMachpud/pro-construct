import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import {
  getAllGlobalMaterialsController,
  getGlobalMaterialsByCategoryController,
  getGlobalMaterialByIdController,
  createGlobalMaterialController,
  updateGlobalMaterialController,
  removeGlobalMaterialController,
} from "../controllers/global_materials.controller";

export const globalMaterialsRouter = Router();

globalMaterialsRouter.use(authenticate);

globalMaterialsRouter.get("/", getAllGlobalMaterialsController);
globalMaterialsRouter.get(
  "/category/:categoryId",
  getGlobalMaterialsByCategoryController,
);
globalMaterialsRouter.get("/:id", getGlobalMaterialByIdController);
globalMaterialsRouter.post(
  "/",
  authorize("admin"),
  createGlobalMaterialController,
);
globalMaterialsRouter.put(
  "/:id",
  authorize("admin"),
  updateGlobalMaterialController,
);
globalMaterialsRouter.delete(
  "/:id",
  authorize("admin"),
  removeGlobalMaterialController,
);
