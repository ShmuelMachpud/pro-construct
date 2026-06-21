import Joi from "joi";

export type CategoryFormType = { name: string; description: string };

export const categoryInitialData: CategoryFormType = { name: "", description: "" };

export const categorySchema = Joi.object<CategoryFormType>({
  name: Joi.string().min(2).required().messages({
    "string.empty": "שם קטגוריה הוא שדה חובה",
    "string.min": "שם קטגוריה חייב להכיל לפחות 2 תווים",
    "any.required": "שם קטגוריה הוא שדה חובה",
  }),
  description: Joi.string().allow("").optional(),
});
