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

export const updateClient = async (id: string, dto: Partial<CreateClientDto>): Promise<Client> => {
  const { data } = await axiosInstance.put(`/clients/${id}`, dto);
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/clients/${id}`);
};

export const getClientById = async (id: string): Promise<Client> => {
  const { data } = await axiosInstance.get(`/clients/${id}`);
  return data;
};
