import {
  CreateCustomerDto,
  CreateCustomerInterface,
} from "../types/customer.types";

export const normalizeCreateCustomer = (
  dto: CreateCustomerDto,
  userId: string,
): CreateCustomerInterface => {
  return { ...dto, contractorId: userId };
};
