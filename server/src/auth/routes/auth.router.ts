import { Router } from "express";
import { register, login, approveUser, getPendingContractors } from "../controllers/auth.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../model/user.entity";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/pending", authenticate, authorize(UserRole.ADMIN, UserRole.OPERATOR), getPendingContractors);
authRouter.patch("/users/:id/approve", authenticate, authorize(UserRole.ADMIN), approveUser);
