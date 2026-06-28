import Joi from "joi";

export type CreateCustomerFormType = {
  type: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  billingName: string;
  billingPhone: string;
  billingAddress: string;
};

export const createCustomerInitialData: CreateCustomerFormType = {
  type: "private",
  name: "",
  phone: "",
  email: "",
  address: "",
  billingName: "",
  billingPhone: "",
  billingAddress: "",
};

const phonePattern = /^0[0-9]{8,9}$/;

export const createCustomerSchema = Joi.object<CreateCustomerFormType>({
  type: Joi.string().valid("private", "business").required(),
  name: Joi.string().min(2).required().messages({
    "string.empty": "שם הלקוח הוא שדה חובה",
    "string.min": "שם הלקוח חייב להכיל לפחות 2 תווים",
    "any.required": "שם הלקוח הוא שדה חובה",
  }),
  phone: Joi.string().pattern(phonePattern).required().messages({
    "string.empty": "טלפון הוא שדה חובה",
    "string.pattern.base": "מספר טלפון לא תקין (לדוגמה: 0501234567)",
    "any.required": "טלפון הוא שדה חובה",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow("")
    .optional()
    .messages({
      "string.email": "כתובת אימייל לא תקינה",
    }),
  address: Joi.string().allow("").optional(),
  billingName: Joi.string().allow("").optional(),
  billingPhone: Joi.string()
    .pattern(phonePattern)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "מספר טלפון לחשבונית לא תקין (לדוגמה: 0501234567)",
    }),
  billingAddress: Joi.string().allow("").optional(),
});
