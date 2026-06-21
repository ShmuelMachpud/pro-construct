import { Router } from "express";
import {
  getClientsByContractorController,
  getAllClientsController,
  getClientByIdController,
  createClientController,
  updateClientController,
  removeClientController,
} from "../controllers/clients.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/auth.types";

export const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get("/contractor/:contractorId", authorize(UserRole.ADMIN, UserRole.OPERATOR), getClientsByContractorController);
clientsRouter.get("/", getAllClientsController);
clientsRouter.get("/:id", getClientByIdController);
clientsRouter.post("/", createClientController);
clientsRouter.put("/:id", updateClientController);
clientsRouter.delete("/:id", removeClientController);
