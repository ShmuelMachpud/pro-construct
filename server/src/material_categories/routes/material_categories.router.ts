import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
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
  authorize("admin"),
  createMaterialCategoryController,
);
materialCategoriesRouter.put(
  "/:id",
  authorize("admin"),
  updateMaterialCategoryController,
);
materialCategoriesRouter.delete(
  "/:id",
  authorize("admin"),
  removeMaterialCategoryController,
);
