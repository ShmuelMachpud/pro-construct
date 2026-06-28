export enum ProjectType {
  CONSTRUCTION = "construction",
  RENOVATION = "renovation",
}

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface CreateProjectDto {
  customerId: string;
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
  status?: ProjectStatus;
  location?: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  squareMeters?: number | null;
  permitNumber?: string | null;
  notes?: string | null;
}
