import Joi from "joi";

export type AddContractorMaterialFormType = {
  globalMaterialId: string;
  price: string;
  supplier: string;
  notes: string;
};

export const addContractorMaterialInitialData: AddContractorMaterialFormType = {
  globalMaterialId: "",
  price: "",
  supplier: "",
  notes: "",
};

export const addContractorMaterialSchema = Joi.object<AddContractorMaterialFormType>({
  globalMaterialId: Joi.string().pattern(/^[1-9][0-9]*$/).required().messages({
    "string.pattern.base": "יש לבחור חומר",
    "string.empty": "יש לבחור חומר",
    "any.required": "יש לבחור חומר",
  }),
  price: Joi.string().allow("").optional().custom((val, helpers) => {
    if (!val) return val;
    const n = Number(val);
    if (isNaN(n) || n < 0) return helpers.error("any.invalid");
    return val;
  }).messages({ "any.invalid": "מחיר חייב להיות 0 ומעלה" }),
  supplier: Joi.string().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});
