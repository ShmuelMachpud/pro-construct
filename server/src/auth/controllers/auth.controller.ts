import { Request, Response } from "express";
import { registerService, loginService, approveUserService, getPendingContractorsService } from "../services/auth.service";
import { AuthRequest } from "../../middleware/auth.types";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await approveUserService(req.params.id as string);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPendingContractors = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getPendingContractorsService();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
