type ClientType = "private" | "business";

export interface Client {
  id: string;
  type: ClientType;
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

export interface CreateClientDto {
  type: ClientType;
  name: string;
  phone: string;
  email: string;
  address: string;
  billingName?: string;
  billingPhone?: string;
  billingAddress?: string;
}
