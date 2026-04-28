import { Router } from "express";
import { createClient, getClients, getClientById, updateClient, deleteClient } from "./client.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);

router.get("/", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getClients);
router.get("/:id", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getClientById);
router.post("/", authorize(UserRole.CONTRACTOR), createClient);
router.put("/:id", authorize(UserRole.CONTRACTOR), updateClient);
router.delete("/:id", authorize(UserRole.CONTRACTOR), deleteClient);

export default router;
