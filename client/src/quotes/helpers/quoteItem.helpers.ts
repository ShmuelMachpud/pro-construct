import Joi from "joi";
import type { QuoteItemType } from "../types/quotes.types";

export const isSourceRequired = (type: string): boolean =>
  type === "MATERIAL";

export type QuoteItemFormType = {
  type: string;
  contractorMaterialId: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

export const quoteItemInitialData: QuoteItemFormType = {
  type: "MATERIAL",
  contractorMaterialId: "",
  description: "",
  quantity: "",
  unitPrice: "",
};

export const quoteItemSchema = Joi.object<QuoteItemFormType>({
  type: Joi.string().valid("MATERIAL", "LABOR", "OTHER").required(),
  contractorMaterialId: Joi.string().when("type", {
    is: "MATERIAL",
    then: Joi.string().pattern(/^[1-9][0-9]*$/).required().messages({
      "string.pattern.base": "יש לבחור חומר",
      "string.empty": "יש לבחור חומר",
      "any.required": "יש לבחור חומר",
    }),
    otherwise: Joi.string().allow("").optional(),
  }),
  description: Joi.string().required().messages({
    "string.empty": "יש להזין תיאור",
    "any.required": "יש להזין תיאור",
  }),
  quantity: Joi.string().required().custom((val, helpers) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return helpers.error("any.invalid");
    return val;
  }).messages({
    "string.empty": "יש להזין כמות",
    "any.required": "יש להזין כמות",
    "any.invalid": "כמות חייבת להיות גדולה מ-0",
  }),
  unitPrice: Joi.string().required().custom((val, helpers) => {
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) return helpers.error("any.invalid");
    return val;
  }).messages({
    "string.empty": "יש להזין מחיר ליחידה",
    "any.required": "יש להזין מחיר ליחידה",
    "any.invalid": "מחיר לא תקין",
  }),
});

export const toQuoteItemType = (val: string): QuoteItemType => val as QuoteItemType;
