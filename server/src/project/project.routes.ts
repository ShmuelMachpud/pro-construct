import { Router } from "express";
import { createProject, getProjects, getProjectById } from "./project.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticate);

router.get("/", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getProjects);
router.get("/:id", authorize(UserRole.CONTRACTOR, UserRole.SITE_MANAGER), getProjectById);
router.post("/", authorize(UserRole.CONTRACTOR), createProject);

export default router;