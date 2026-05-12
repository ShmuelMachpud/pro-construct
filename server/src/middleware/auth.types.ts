import { Request } from "express";
import { UserRole } from "../auth/model/user.entity";

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
