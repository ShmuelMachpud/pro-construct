import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { CustomError } from "../utils/customError";

export const handleServerError = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    logger.error(
      `${err.status} ${req.method} ${req.originalUrl} - ${err.message}`,
    );
    res.status(err.status).json({ message: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  logger.error(`500 ${req.method} ${req.originalUrl} - ${message}`);
  res.status(500).json({ message: message || "Internal Server Error" });
};
