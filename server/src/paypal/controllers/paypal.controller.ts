import { handleError } from "../../utils/handleError";
import { Request, Response } from "express";
import { createSubscriptionService } from "../services/paypal.service";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { interval } = req.body; // "MONTH" / "YEAR"

    const planId =
      interval === "MONTH"
        ? process.env.PAYPAL_MONTHLY_PLAN_ID!
        : process.env.PAYPAL_YEARLY_PLAN_ID!;

    const { subscriptionId, approvalUrl } =
      await createSubscriptionService(planId);

    res.json({ subscriptionId, approvalUrl });
  } catch (error) {
    handleError(error, res);
  }
};
