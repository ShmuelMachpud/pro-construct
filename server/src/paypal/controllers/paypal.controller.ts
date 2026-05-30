import { handleError } from "../../utils/handleError";
import { Request, Response } from "express";
import { createSubscriptionService } from "../services/paypal.service";
import { ENV_PAYPAL } from "../../config/environments";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { interval } = req.body; // "MONTH" / "YEAR"
    const { MONTHLY_PLAN_ID, YEARLY_PLAN_ID } = ENV_PAYPAL;

    const planId = interval === "MONTH" ? MONTHLY_PLAN_ID! : YEARLY_PLAN_ID!;

    const { subscriptionId, approvalUrl } =
      await createSubscriptionService(planId);

    res.json({ subscriptionId, approvalUrl });
  } catch (error) {
    handleError(error, res);
  }
};
