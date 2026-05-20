import { CreateClientDto, CreateClientInterface } from "../types/clients.types";

export const normalizeCreateClient = (
  dto: CreateClientDto,
  userId: string,
): CreateClientInterface => {
  return { ...dto, contractorId: userId };
};
