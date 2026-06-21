import { useState, useEffect } from "react";
import { useForm } from "../../global/hooks/useForm";
import { categoryInitialData, categorySchema, type CategoryFormType } from "../helpers/category.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { MaterialCategory, CreateCategoryDto } from "../types/materials.types";

export const useCategory = (
  editItem: MaterialCategory | null | undefined,
  open: boolean,
  onSave: (dto: CreateCategoryDto) => Promise<void>,
  onClose: () => void,
) => {
  const { values, setValue, errors, onBlur, isValid, validate, resetTo } =
    useForm<CategoryFormType>(categoryInitialData, categorySchema);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editItem) {
      resetTo({ name: editItem.name, description: editItem.description ?? "" });
    } else {
      resetTo(categoryInitialData);
    }
    setServerError("");
  }, [editItem, open]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await onSave({ name: values.name.trim(), description: values.description.trim() || undefined });
      onClose();
    } catch (err: unknown) {
      setServerError(getServerError(err) ?? "שגיאה בשמירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit };
};
