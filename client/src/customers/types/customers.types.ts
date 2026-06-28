export type CustomerType = "private" | "business";

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  phone: string;
  email: string;
  address: string;
  billingName?: string;
  billingPhone?: string;
  billingAddress?: string;
  createdAt: string;
  updatedAt: string;
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
