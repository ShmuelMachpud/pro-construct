import { Router } from "express";
import { handleError } from "../utils/handleError";
import { CustomError } from "../utils/customError";
import { authRouter } from "../auth/routes/auth.router";
import { usersRouter } from "../users/routes/users.router";

export const router = Router();

// Register module routers here:
router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.use((req, res) =>
  handleError(
    new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404),
    res,
  ),
);
