import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";
import {
  getContractorMaterialsByContractorController,
  getAllContractorMaterialsController,
  getContractorMaterialByIdController,
  addContractorMaterialController,
  updateContractorMaterialController,
  removeContractorMaterialController,
} from "../controllers/contractor_materials.controller";

export const contractorMaterialsRouter = Router();

// Every route requires a valid JWT first
contractorMaterialsRouter.use(authenticate);

// Admin / Operator may view any contractor's price list (read-only)
contractorMaterialsRouter.get("/contractor/:contractorId", authorize(UserRole.ADMIN, UserRole.OPERATOR), getContractorMaterialsByContractorController);

// Only a contractor can modify a price list - and the service layer
// always scopes the operation to the contractor id from the JWT
contractorMaterialsRouter.get("/", getAllContractorMaterialsController);
contractorMaterialsRouter.get("/:id", getContractorMaterialByIdController);
contractorMaterialsRouter.post("/", authorize(UserRole.CONTRACTOR), addContractorMaterialController);
contractorMaterialsRouter.put("/:id", authorize(UserRole.CONTRACTOR), updateContractorMaterialController);
contractorMaterialsRouter.delete("/:id", authorize(UserRole.CONTRACTOR), removeContractorMaterialController);
