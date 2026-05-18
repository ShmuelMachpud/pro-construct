import { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  getPendingUsersService,
  approveUserService,
  // updateUserService,
  // removeUserService,
} from "../services/users.service";

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

export const getPendingUsersController = async (_: Request, res: Response) => {
  try {
    const users = await getPendingUsersService();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};

export const approveUserController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await approveUserService(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
};

// export const updateUserController = async (
//   req: Request<{ id: string }>,
//   res: Response,
// ) => {
//   try {
//     const user = await updateUserService(req.params.id, req.body);
//     res.status(200).json(user);
//   } catch (error) {
//     handleError(error, res);
//   }
// };

// export const removeUserController = async (
//   req: Request<{ id: string }>,
//   res: Response,
// ) => {
//   try {
//     await removeUserService(req.params.id);
//     res.status(204).send();
//   } catch (error) {
//     handleError(error, res);
//   }
// };
