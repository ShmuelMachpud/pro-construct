import { Response } from "express";
import { logger } from "./logger";
import { CustomError } from "./customError";

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof CustomError) {
    logger.error(`${err.status} - ${err.message}`);
    res.status(err.status).json({ message: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  logger.error(`500 - ${message}`);
  res.status(500).json({ message: message || "Internal Server Error" });
};
