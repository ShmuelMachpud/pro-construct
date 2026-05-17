import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.types";
import { handleError } from "../../utils/handleError";
import {
  getAllUsersService,
  getUserByIdService,
  getPendingContractorsService,
  approveUserService,
  //  updateUserService
} from "../services/users.service";

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id as string);
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const getPendingContractors = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const users = await getPendingContractorsService();
    res.status(200).json(users);
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

// export const updateUser = async (req: AuthRequest, res: Response) => {
//   try {
//     const user = await updateUserService(req.params.id as string, req.body);
//     res.status(200).json(user);
//   } catch (error) {
//     handleError(error, res);
//   }
// };
