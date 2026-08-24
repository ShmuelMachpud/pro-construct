import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  getPendingUsersController,
  approveUserController,
  //   updateUserController,
  //   removeUserController,
} from "../controllers/users.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { UserRole } from "../types/users.types";

export const usersRouter = Router();
usersRouter.get(
  "/pending",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getPendingUsersController,
);

usersRouter.patch(
  "/:id/approve",
  authenticate,
  authorize(UserRole.ADMIN),
  approveUserController,
);

usersRouter.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getAllUsersController,
);
usersRouter.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  getUserByIdController,
);

usersRouter.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  createUserController,
);
// usersRouter.put(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN, UserRole.OPERATOR),
//   updateUserController,
// );
// usersRouter.delete(
//   "/:id",
//   authenticate,
//   authorize(UserRole.ADMIN),
//   removeUserController,
// );
