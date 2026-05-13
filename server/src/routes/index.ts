import { Router, Request, Response } from "express";
import { authRouter } from "../auth/routes/auth.router";
import { projectsRouter } from "../projects/routes/projects.router";
import { clientsRouter } from "../clients/routes/clients.router";
import { handleError } from "../utils/handleError";
import { CustomError } from "../utils/customError";

export const router = Router();

router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/clients", clientsRouter);

router.use((req: Request, res: Response) =>
  handleError(new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404), res)
);
