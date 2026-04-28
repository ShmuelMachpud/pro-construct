export interface Client {
  id: number;
  name: string;
  type: "private" | "business";
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  notes?: string;
  contractorId: number;
  createdAt: string;
}

export interface CreateClientDto {
  name: string;
  type: "private" | "business";
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  notes?: string;
}
