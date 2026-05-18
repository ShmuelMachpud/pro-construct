import { Request } from "express";
import { UserRole } from "../users/types/users.types";

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
