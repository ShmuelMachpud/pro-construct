export enum CustomerType {
  PRIVATE = "private",
  BUSINESS = "business",
}

export interface CreateCustomerDto {
  type: CustomerType;
  name: string;
  phone: string;
  email: string;
  address: string;
  billingName?: string;
  billingPhone?: string;
  billingAddress?: string;
}
export interface CreateCustomerInterface extends CreateCustomerDto {
  contractorId: string;
}

export interface UpdateCustomerDto {
  type?: CustomerType;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  billingName?: string;
  billingPhone?: string;
  billingAddress?: string;
}
