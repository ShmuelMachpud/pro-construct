import { Router } from "express";
import {
  checkEmailController,
  loginController,
  registerController,
} from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", registerController);
// POST (not GET) so the email never appears in URLs / server logs
authRouter.post("/check-email", checkEmailController);
authRouter.post("/login", loginController);
