import { Router } from "express";
import { createSubscriptionController } from "../controllers/paypal.controller";

export const paypalRouter = Router();

// Public route: subscriptions are created during registration,
// before the user has an account or a JWT
paypalRouter.post("/create-subscription", createSubscriptionController);
