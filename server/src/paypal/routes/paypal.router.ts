import { Router } from "express";
import { createSubscriptionController } from "../controllers/paypal.controller";

export const paypalRouter = Router();

paypalRouter.post("/create-subscription", createSubscriptionController);
