import { useState, useEffect } from "react";
import {
  getContractorMaterials,
  addContractorMaterial,
  updateContractorMaterial,
  deleteContractorMaterial,
} from "../services/contractorMaterials.service";
import type {
  ContractorMaterial,
  AddContractorMaterialDto,
  UpdateContractorMaterialDto,
} from "../types/materials.types";

export const useContractorMaterials = () => {
  const [materials, setMaterials] = useState<ContractorMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getContractorMaterials()
      .then(setMaterials)
      .catch(() => setError("שגיאה בטעינת החומרים"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (dto: AddContractorMaterialDto): Promise<void> => {
    const created = await addContractorMaterial(dto);
    setMaterials((prev) => [created, ...prev]);
  };

  const handleUpdate = async (
    id: number,
    dto: UpdateContractorMaterialDto,
  ): Promise<void> => {
    const updated = await updateContractorMaterial(id, dto);
    setMaterials((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteContractorMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return { materials, loading, error, handleAdd, handleUpdate, handleDelete };
};
