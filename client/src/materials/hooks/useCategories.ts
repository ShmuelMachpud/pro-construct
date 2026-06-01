import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories.service";
import type {
  MaterialCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/materials.types";

export const useCategories = () => {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => setError("שגיאה בטעינת הקטגוריות"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (dto: CreateCategoryDto): Promise<void> => {
    const created = await createCategory(dto);
    setCategories((prev) => [...prev, created]);
  };

  const handleUpdate = async (
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<void> => {
    const updated = await updateCategory(id, dto);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return { categories, loading, error, handleCreate, handleUpdate, handleDelete };
};
