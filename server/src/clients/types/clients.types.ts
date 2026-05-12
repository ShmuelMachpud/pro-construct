export interface CreateClientDto {
  name: string;
  type: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  notes?: string;
}
