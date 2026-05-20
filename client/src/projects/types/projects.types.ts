export type ProjectType = "construction" | "renovation";

export type ProjectStatus = "planning" | "in_progress" | "completed";

export interface Project {
  id: string;
  clientId: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  location: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  squareMeters: number | null;
  permitNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  clientId: string;
  name: string;
  type: ProjectType;
  location: string;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  squareMeters?: number | null;
  permitNumber?: string | null;
  notes?: string | null;
}

export interface UpdateProjectDto {
  name?: string;
  type?: ProjectType;
  location?: string;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  squareMeters?: number | null;
  permitNumber?: string | null;
  notes?: string | null;
}

export type UpdateProjectFormType = {
  name: string;
  type: string;
  location: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  squareMeters: string;
  permitNumber: string;
  notes: string;
};

export type CreateProjectFormType = {
  name: string;
  type: string;
  location: string;
  clientId: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  squareMeters: string;
  permitNumber: string;
  notes: string;
};
