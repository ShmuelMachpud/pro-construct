import { Response } from "express";
import { CustomError } from "./customError";
import { logger } from "./logger";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    res.status(error.status).json({ message: error.message });
  } else {
    logger.error(error instanceof Error ? error.message : String(error));
    res.status(500).json({ message: "Internal server error" });
  }
};
