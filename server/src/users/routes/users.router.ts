import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../model/user.entity";
import {
  getAllUsers,
  getUserById,
  getPendingContractors,
  approveUser,
  //  updateUser
} from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getAllUsers,
);
usersRouter.get(
  "/pending",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getPendingContractors,
);
usersRouter.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getUserById,
);
usersRouter.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.ADMIN),
  approveUser,
);
// usersRouter.patch("/:id", authenticate, authorize(UserRole.ADMIN, UserRole.OPERATOR), updateUser);
