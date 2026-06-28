import { CustomError } from "../../utils/customError";
import {
  findCustomersByContractorDal,
  findCustomerByIdDal,
  insertCustomerDal,
  updateCustomerByIdDal,
  deleteCustomerDal,
} from "../dal/customers.dal";
import { normalizeCreateCustomer } from "../helpers/customers.helpers";
import { CreateCustomerDto, UpdateCustomerDto } from "../types/customer.types";

export const getCustomersByContractorService = async (contractorId: string) => {
  try {
    return await findCustomersByContractorDal(contractorId);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerByIdService = async (id: string, userId: string) => {
  try {
    const item = await findCustomerByIdDal(id, userId);
    if (!item) throw new CustomError("Customer not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createCustomerService = async (
  dto: CreateCustomerDto,
  userId: string,
) => {
  try {
    const normalizedDto = normalizeCreateCustomer(dto, userId);
    return await insertCustomerDal(normalizedDto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateCustomerService = async (
  id: string,
  dto: UpdateCustomerDto,
  userId: string,
) => {
  try {
    const item = await updateCustomerByIdDal(id, dto, userId);
    if (!item) throw new CustomError("Customer not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeCustomerService = async (id: string, userId: string) => {
  try {
    const deleted = await deleteCustomerDal(id, userId);
    if (!deleted) throw new CustomError("Customer not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
