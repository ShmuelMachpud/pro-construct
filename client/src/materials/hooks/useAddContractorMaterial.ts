import { useState } from "react";
import { useForm } from "../../global/hooks/useForm";
import {
  addContractorMaterialInitialData,
  addContractorMaterialSchema,
  type AddContractorMaterialFormType,
} from "../helpers/addContractorMaterial.helpers";
import { getServerError } from "../../global/utils/getServerError";
import type { AddContractorMaterialDto } from "../types/materials.types";

// Hook that drives the "add material to my price list" modal.
// Uses the generic useForm hook with a Joi validation schema.
export const useAddContractorMaterial = (
  onSave: (dto: AddContractorMaterialDto) => Promise<void>,
  onClose: () => void,
) => {
  const { values, setValue, errors, onBlur, isValid, validate, reset } =
    useForm<AddContractorMaterialFormType>(
      addContractorMaterialInitialData,
      addContractorMaterialSchema,
    );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleClose = () => {
    reset();
    setServerError("");
    onClose();
  };

  const handleSubmit = async () => {
    // Client-side validation runs first; the server re-validates anyway
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      // Normalize form strings into a typed DTO:
      // empty optional fields are sent as undefined, not empty strings
      await onSave({
        globalMaterialId: Number(values.globalMaterialId),
        price: values.price !== "" ? Number(values.price) : undefined,
        supplier: values.supplier.trim() || undefined,
        notes: values.notes.trim() || undefined,
      });
      handleClose();
    } catch (err: unknown) {
      // Surfaces server errors (e.g. 409 duplicate material) to the UI

      setServerError(getServerError(err) ?? "שגיאה בהוספה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValue,
    errors,
    onBlur,
    isValid,
    loading,
    serverError,
    handleSubmit,
    handleClose,
  };
};
