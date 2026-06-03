import { Request } from "express";

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
  CONTRACTOR = "contractor",
}

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
