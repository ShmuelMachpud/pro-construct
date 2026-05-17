import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";
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
