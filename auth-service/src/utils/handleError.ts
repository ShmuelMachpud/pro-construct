import { Response } from "express";
import { CustomError } from "./customError";
import { logger } from "./logger";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    logger.error(`${error.status} - ${error.message}`);
    res.status(error.status).json({ message: error.message });
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`500 - ${message}`);
  res.status(500).json({ message: "Internal server error" });
};
