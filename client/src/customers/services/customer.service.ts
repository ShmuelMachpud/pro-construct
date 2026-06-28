import axiosInstance from "../../global/services/axiosServer";
import type { Customer, CreateCustomerDto } from "../types/customers.types";

// export type { Customer, CreateCustomerDto };

export const getCustomers = async (): Promise<Customer[]> => {
  const { data } = await axiosInstance.get("/customers");
  return data;
};

export const createCustomer = async (
  dto: CreateCustomerDto,
): Promise<Customer> => {
  const { data } = await axiosInstance.post("/customers", dto);
  return data;
};

export const updateCustomer = async (
  id: string,
  dto: Partial<CreateCustomerDto>,
): Promise<Customer> => {
  const { data } = await axiosInstance.put(`/customers/${id}`, dto);
  return data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/customers/${id}`);
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const { data } = await axiosInstance.get(`/customers/${id}`);
  return data;
};
