import { ProjectMaterial } from "../model/project_material.entity";

export const isDuplicateProjectMaterial = (
  existing: ProjectMaterial | null,
): boolean => existing !== null;
