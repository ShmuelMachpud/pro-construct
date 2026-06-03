import { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import { loginService, registerService } from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
};
