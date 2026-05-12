export interface CreateProjectDto {
  name: string;
  type: string;
  city: string;
  address?: string;
  budget?: number;
  permitStatus?: string;
  siteManagerId?: string;
  clientId?: number;
  newClient?: {
    name: string;
    type: string;
    phone: string;
    email?: string;
    address?: string;
    idNumber?: string;
    notes?: string;
  };
}
