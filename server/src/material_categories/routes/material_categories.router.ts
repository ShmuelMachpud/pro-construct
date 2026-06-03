import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";
import {
  getAllMaterialCategoriesController,
  getMaterialCategoryByIdController,
  createMaterialCategoryController,
  updateMaterialCategoryController,
  removeMaterialCategoryController,
} from "../controllers/material_categories.controller";

export const materialCategoriesRouter = Router();

materialCategoriesRouter.use(authenticate);

materialCategoriesRouter.get("/", getAllMaterialCategoriesController);
materialCategoriesRouter.get("/:id", getMaterialCategoryByIdController);
materialCategoriesRouter.post(
  "/",
  authorize(UserRole.ADMIN),
  createMaterialCategoryController,
);
materialCategoriesRouter.put(
  "/:id",
  authorize(UserRole.ADMIN),
  updateMaterialCategoryController,
);
materialCategoriesRouter.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  removeMaterialCategoryController,
);
