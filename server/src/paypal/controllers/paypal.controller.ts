import { handleError } from "../../utils/handleError";
import { Request, Response } from "express";
import { createSubscriptionService } from "../services/paypal.service";
import { CustomError } from "../../utils/customError";

export const createSubscriptionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { interval } = req.body;
    if (interval !== "MONTH" && interval !== "YEAR")
      throw new CustomError("Invalid interval, expected MONTH or YEAR", 400);

    const { subscriptionId, approvalUrl } =
      await createSubscriptionService(interval);
    res.status(201).json({ subscriptionId, approvalUrl });
  } catch (error) {
    handleError(error, res);
  }
};
