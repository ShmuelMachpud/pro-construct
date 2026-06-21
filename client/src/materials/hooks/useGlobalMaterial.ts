import { useState, useEffect } from "react";
import { useForm } from "../../global/hooks/useForm";
import { globalMaterialInitialData, globalMaterialSchema, type GlobalMaterialFormType } from "../helpers/globalMaterial.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { GlobalMaterial, CreateGlobalMaterialDto } from "../types/materials.types";

export const useGlobalMaterial = (
  editItem: GlobalMaterial | null | undefined,
  open: boolean,
  onSave: (dto: CreateGlobalMaterialDto) => Promise<void>,
  onClose: () => void,
) => {
  const { values, setValue, errors, onBlur, isValid, validate, resetTo } =
    useForm<GlobalMaterialFormType>(globalMaterialInitialData, globalMaterialSchema);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editItem) {
      resetTo({
        name: editItem.name,
        categoryId: String(editItem.categoryId),
        unit: editItem.unit,
        description: editItem.description ?? "",
      });
    } else {
      resetTo(globalMaterialInitialData);
    }
    setServerError("");
  }, [editItem, open]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await onSave({
        name: values.name.trim(),
        categoryId: Number(values.categoryId),
        unit: values.unit.trim(),
        description: values.description.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setServerError(getServerError(err) ?? "שגיאה בשמירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit };
};
