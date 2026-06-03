import { handleError } from "../../utils/handleError";
import { Request, Response } from "express";
import { createSubscriptionService } from "../services/paypal.service";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { interval } = req.body;
    const { subscriptionId, approvalUrl } = await createSubscriptionService(interval);
    res.status(201).json({ subscriptionId, approvalUrl });
  } catch (error) {
    handleError(error, res);
  }
};
