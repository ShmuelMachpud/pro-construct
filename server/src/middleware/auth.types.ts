import { Request } from "express";
import { UserRole } from "../users/model/user.entity";

export interface AuthPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
