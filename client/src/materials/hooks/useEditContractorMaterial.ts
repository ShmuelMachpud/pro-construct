import { useState, useEffect } from "react";
import { useForm } from "../../global/hooks/useForm";
import {
  editContractorMaterialInitialData,
  editContractorMaterialSchema,
  type EditContractorMaterialFormType,
} from "../helpers/editContractorMaterial.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { ContractorMaterial, UpdateContractorMaterialDto } from "../types/materials.types";

export const useEditContractorMaterial = (
  editItem: ContractorMaterial | null,
  open: boolean,
  onSave: (id: number, dto: UpdateContractorMaterialDto) => Promise<void>,
  onClose: () => void,
) => {
  const { values, setValue, errors, onBlur, isValid, validate, resetTo } =
    useForm<EditContractorMaterialFormType>(editContractorMaterialInitialData, editContractorMaterialSchema);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editItem) {
      resetTo({
        price: editItem.price != null ? String(editItem.price) : "",
        supplier: editItem.supplier ?? "",
        notes: editItem.notes ?? "",
      });
    } else {
      resetTo(editContractorMaterialInitialData);
    }
    setServerError("");
  }, [editItem, open]);

  const handleSubmit = async () => {
    if (!editItem || !validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await onSave(editItem.id, {
        price: values.price !== "" ? Number(values.price) : undefined,
        supplier: values.supplier.trim() || undefined,
        notes: values.notes.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setServerError(getServerError(err) ?? "שגיאה בעדכון, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit };
};
