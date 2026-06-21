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

contractorMaterialsRouter.use(authenticate);

contractorMaterialsRouter.get("/contractor/:contractorId", authorize(UserRole.ADMIN, UserRole.OPERATOR), getContractorMaterialsByContractorController);
contractorMaterialsRouter.get("/", getAllContractorMaterialsController);
contractorMaterialsRouter.get("/:id", getContractorMaterialByIdController);
contractorMaterialsRouter.post("/", addContractorMaterialController);
contractorMaterialsRouter.put("/:id", updateContractorMaterialController);
contractorMaterialsRouter.delete("/:id", removeContractorMaterialController);
