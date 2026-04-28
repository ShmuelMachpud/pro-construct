import axiosInstance from "../../global/services/axios";
import type { Client, CreateClientDto } from "../types/clients.types";

export type { Client, CreateClientDto };

export const getClients = async (): Promise<Client[]> => {
  const { data } = await axiosInstance.get("/clients");
  return data;
};

export const createClient = async (dto: CreateClientDto): Promise<Client> => {
  const { data } = await axiosInstance.post("/clients", dto);
  return data;
};

export const updateClient = async (id: number, dto: Partial<CreateClientDto>): Promise<Client> => {
  const { data } = await axiosInstance.put(`/clients/${id}`, dto);
  return data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/clients/${id}`);
};
