import { Router } from "express";
import { createClient, getClients, getClientById, updateClient, deleteClient } from "../controllers/clients.controller";
import { authenticate, authorize } from "../../shared/middleware/auth.middleware";
import { UserRole } from "../../entities/User";

export const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get("/", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getClients);
clientsRouter.get("/:id", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getClientById);
clientsRouter.post("/", authorize(UserRole.CONTRACTOR), createClient);
clientsRouter.put("/:id", authorize(UserRole.CONTRACTOR), updateClient);
clientsRouter.delete("/:id", authorize(UserRole.CONTRACTOR), deleteClient);
