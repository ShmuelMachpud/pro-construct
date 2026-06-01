import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  getAllContractorMaterialsController,
  getContractorMaterialByIdController,
  addContractorMaterialController,
  updateContractorMaterialController,
  removeContractorMaterialController,
} from "../controllers/contractor_materials.controller";

export const contractorMaterialsRouter = Router();

contractorMaterialsRouter.use(authenticate);

contractorMaterialsRouter.get("/", getAllContractorMaterialsController);
contractorMaterialsRouter.get("/:id", getContractorMaterialByIdController);
contractorMaterialsRouter.post("/", addContractorMaterialController);
contractorMaterialsRouter.put("/:id", updateContractorMaterialController);
contractorMaterialsRouter.delete("/:id", removeContractorMaterialController);
