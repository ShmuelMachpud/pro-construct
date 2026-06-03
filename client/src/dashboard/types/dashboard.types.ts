import type { UserInterface } from "../../users/types/users.types";
import type { Project } from "../../projects/types/projects.types";

export interface DashboardStats {
  activeContractors: number;
  pendingApprovals: number;
  totalProjects: number;
}

export interface DashboardData {
  contractors: UserInterface[];
  projects: Project[];
  stats: DashboardStats;
}
