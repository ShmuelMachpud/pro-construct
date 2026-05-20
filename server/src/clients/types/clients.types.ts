export enum ClientType {
  PRIVATE = "private",
  BUSINESS = "business",
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
export interface CreateClientInterface extends CreateClientDto {
  contractorId: string;
}

export interface UpdateClientDto {
  type?: ClientType;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  billingName?: string;
  billingPhone?: string;
  billingAddress?: string;
}
