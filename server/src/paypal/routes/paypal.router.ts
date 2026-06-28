import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { createSubscriptionController } from "../controllers/paypal.controller";

export const paypalRouter = Router();

paypalRouter.post("/create-subscription", authenticate, createSubscriptionController);
