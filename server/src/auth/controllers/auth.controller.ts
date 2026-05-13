import { Request, Response } from "express";
import { registerService, loginService, approveUserService, getPendingContractorsService, getAllUsersService } from "../services/auth.service";
import { AuthRequest } from "../../middleware/auth.types";
import { handleError } from "../../utils/handleError";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await approveUserService(req.params.id as string);
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const getPendingContractors = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getPendingContractorsService();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};
