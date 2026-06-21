import Joi from "joi";

export type CreateQuoteFormType = { projectId: string; title: string; validUntil: string; notes: string };

export const createQuoteInitialData: CreateQuoteFormType = {
  projectId: "",
  title: "",
  validUntil: "",
  notes: "",
};

export const createQuoteSchema = (requireProjectId: boolean) =>
  Joi.object<CreateQuoteFormType>({
    projectId: requireProjectId
      ? Joi.string().required().messages({ "string.empty": "יש לבחור פרויקט", "any.required": "יש לבחור פרויקט" })
      : Joi.string().allow("").optional(),
    title: Joi.string().required().messages({
      "string.empty": "יש להזין כותרת להצעה",
      "any.required": "יש להזין כותרת להצעה",
    }),
    validUntil: Joi.string().allow("").optional().custom((val, helpers) => {
      if (!val) return val;
      const today = new Date().toISOString().slice(0, 10);
      if (val < today) return helpers.error("any.invalid");
      return val;
    }).messages({ "any.invalid": "תאריך תפוגה חייב להיות היום או בעתיד" }),
    notes: Joi.string().allow("").optional(),
  });
