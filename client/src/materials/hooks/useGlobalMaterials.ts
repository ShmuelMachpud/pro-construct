import { useState, useEffect } from "react";
import {
  getGlobalMaterials,
  createGlobalMaterial,
  updateGlobalMaterial,
  deleteGlobalMaterial,
} from "../services/globalMaterials.service";
import { useAuth } from "../../global/hooks/useAuth";
import type {
  GlobalMaterial,
  CreateGlobalMaterialDto,
  UpdateGlobalMaterialDto,
} from "../types/materials.types";

export const useGlobalMaterials = () => {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState<GlobalMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getGlobalMaterials()
      .then(setMaterials)
      .catch(() => setError("שגיאה בטעינת החומרים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (dto: CreateGlobalMaterialDto): Promise<void> => {
    const created = await createGlobalMaterial(dto);
    setMaterials((prev) => [...prev, created]);
  };

  const handleUpdate = async (
    id: number,
    dto: UpdateGlobalMaterialDto,
  ): Promise<void> => {
    const updated = await updateGlobalMaterial(id, dto);
    setMaterials((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteGlobalMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return { materials, loading, error, handleCreate, handleUpdate, handleDelete, isAdmin };
};
