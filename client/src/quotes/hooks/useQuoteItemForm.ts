import { useForm } from "../../global/hooks/useForm";
import { quoteItemInitialData, quoteItemSchema, toQuoteItemType, type QuoteItemFormType } from "../helpers/quoteItem.helpers";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { CreateQuoteItemDto, QuoteItemType } from "../types/quotes.types";

export const useQuoteItemForm = (contractorMaterials: ContractorMaterial[]) => {
  const { values, setValue, errors, onBlur, isValid, validate, reset, resetTo } =
    useForm<QuoteItemFormType>(quoteItemInitialData, quoteItemSchema);

  const handleTypeChange = (newType: QuoteItemType) =>
    resetTo({ ...quoteItemInitialData, type: newType });

  const handleMaterialSelect = (materialId: string) => {
    const mat = contractorMaterials.find((m) => String(m.id) === materialId);
    setValue("contractorMaterialId", materialId);
    setValue("description", mat ? mat.globalMaterial.name : "");
    setValue("unitPrice", mat?.price != null ? String(mat.price) : "");
  };

  const selectedMaterial = contractorMaterials.find((m) => String(m.id) === values.contractorMaterialId);

  const lineTotal =
    values.quantity && values.unitPrice
      ? parseFloat(values.quantity) * parseFloat(values.unitPrice)
      : null;

  const buildDto = (): CreateQuoteItemDto => ({
    type: toQuoteItemType(values.type),
    sourceId: values.type === "MATERIAL" ? Number(values.contractorMaterialId) : undefined,
    description: values.description.trim(),
    quantity: parseFloat(values.quantity),
    unitPrice: parseFloat(values.unitPrice),
  });

  return { values, setValue, errors, onBlur, isValid, validate, reset, resetTo, handleTypeChange, handleMaterialSelect, selectedMaterial, lineTotal, buildDto };
};

export type UseQuoteItemFormReturn = ReturnType<typeof useQuoteItemForm>;
