import { CustomError } from "../../utils/customError";
import {
  findAllClientsDal,
  findClientByIdDal,
  insertClientDal,
  updateClientByIdDal,
  deleteClientDal,
} from "../dal/clients.dal";
import { normalizeCreateClient } from "../helpers/clients.helpers";
import { CreateClientDto, UpdateClientDto } from "../types/clients.types";

export const getAllClientsService = async (userId: string) => {
  try {
    return await findAllClientsDal(userId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getClientByIdService = async (id: string, userId: string) => {
  try {
    const item = await findClientByIdDal(id, userId);
    if (!item) throw new CustomError("Client not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createClientService = async (
  dto: CreateClientDto,
  userId: string,
) => {
  try {
    const normalizedDto = normalizeCreateClient(dto, userId);
    return await insertClientDal(normalizedDto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateClientService = async (
  id: string,
  dto: UpdateClientDto,
  userId: string,
) => {
  try {
    const item = await updateClientByIdDal(id, dto, userId);
    if (!item) throw new CustomError("Client not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeClientService = async (id: string, userId: string) => {
  try {
    const deleted = await deleteClientDal(id, userId);
    if (!deleted) throw new CustomError("Client not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
