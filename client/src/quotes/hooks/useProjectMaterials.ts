import { useState, useEffect } from "react";
import {
  getProjectMaterials,
  addProjectMaterial,
  updateProjectMaterial,
  deleteProjectMaterial,
} from "../services/quotes.service";
import type {
  ProjectMaterial,
  AddProjectMaterialDto,
  UpdateProjectMaterialDto,
} from "../types/quotes.types";

export const useProjectMaterials = (projectId: string) => {
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getProjectMaterials(projectId)
      .then(setMaterials)
      .catch(() => setError("שגיאה בטעינת החומרים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [projectId]);

  const handleAdd = async (dto: AddProjectMaterialDto): Promise<void> => {
    const created = await addProjectMaterial(projectId, dto);
    setMaterials((prev) => [...prev, created]);
  };

  const handleUpdate = async (
    id: number,
    dto: UpdateProjectMaterialDto,
  ): Promise<void> => {
    const updated = await updateProjectMaterial(projectId, id, dto);
    setMaterials((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteProjectMaterial(projectId, id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return { materials, loading, error, handleAdd, handleUpdate, handleDelete };
};
