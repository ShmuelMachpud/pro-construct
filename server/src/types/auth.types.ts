import { Request } from "express";

export interface AuthPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
