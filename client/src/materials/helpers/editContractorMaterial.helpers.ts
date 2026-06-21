import Joi from "joi";

export type EditContractorMaterialFormType = { price: string; supplier: string; notes: string };

export const editContractorMaterialInitialData: EditContractorMaterialFormType = {
  price: "",
  supplier: "",
  notes: "",
};

export const editContractorMaterialSchema = Joi.object<EditContractorMaterialFormType>({
  price: Joi.string().allow("").optional().custom((val, helpers) => {
    if (!val) return val;
    const n = Number(val);
    if (isNaN(n) || n < 0) return helpers.error("any.invalid");
    return val;
  }).messages({ "any.invalid": "מחיר חייב להיות 0 ומעלה" }),
  supplier: Joi.string().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});
