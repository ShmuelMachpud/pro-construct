import type { ProjectStatus, ProjectType } from "../types/projects.types";

export const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  planning: { label: "תכנון", color: "#757575" },
  in_progress: { label: "בביצוע", color: "#FF6B00" },
  completed: { label: "הושלם", color: "#4caf50" },
};

export const typeLabels: Record<ProjectType, string> = {
  construction: "בנייה חדשה",
  renovation: "שיפוץ",
};
