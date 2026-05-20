import { Router } from "express";
import {
  getAllClientsController,
  getClientByIdController,
  createClientController,
  updateClientController,
  removeClientController,
} from "../controllers/clients.controller";
import { authenticate } from "../../middleware/auth.middleware";

export const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get("/", getAllClientsController);
clientsRouter.get("/:id", getClientByIdController);
clientsRouter.post("/", createClientController);
clientsRouter.put("/:id", updateClientController);
clientsRouter.delete("/:id", removeClientController);
