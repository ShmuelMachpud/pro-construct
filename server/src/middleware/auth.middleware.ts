import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/environments";
import { AuthPayload, AuthRequest, UserRole } from "../types/auth.types";
import { logger } from "../utils/logger";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `[403] ${req.method} ${req.originalUrl} — role "${req.user?.role}" not in [${roles.join(", ")}]`,
      );
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};
