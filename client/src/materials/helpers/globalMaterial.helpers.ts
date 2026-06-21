import Joi from "joi";

export type GlobalMaterialFormType = { name: string; categoryId: string; unit: string; description: string };

export const globalMaterialInitialData: GlobalMaterialFormType = {
  name: "",
  categoryId: "",
  unit: "",
  description: "",
};

export const globalMaterialSchema = Joi.object<GlobalMaterialFormType>({
  name: Joi.string().min(2).required().messages({
    "string.empty": "שם חומר הוא שדה חובה",
    "string.min": "שם חומר חייב להכיל לפחות 2 תווים",
    "any.required": "שם חומר הוא שדה חובה",
  }),
  categoryId: Joi.string().pattern(/^[1-9][0-9]*$/).required().messages({
    "string.pattern.base": "יש לבחור קטגוריה",
    "string.empty": "יש לבחור קטגוריה",
    "any.required": "יש לבחור קטגוריה",
  }),
  unit: Joi.string().min(1).required().messages({
    "string.empty": "יחידת מידה היא שדה חובה",
    "any.required": "יחידת מידה היא שדה חובה",
  }),
  description: Joi.string().allow("").optional(),
});
