import Joi from "joi";
import type { FieldConfig } from "../../global/components/GenericForm";
import type { RegisterFormType, PaymentFormType } from "../types/auth.types";

export const registerSchema = Joi.object<RegisterFormType>({
  name: Joi.string().required().messages({ "string.empty": "שם מלא הוא שדה חובה", "any.required": "שם מלא הוא שדה חובה" }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "אימייל הוא שדה חובה",
    "string.email": "כתובת אימייל לא תקינה",
    "any.required": "אימייל הוא שדה חובה",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "סיסמה חייבת להכיל לפחות 6 תווים",
    "any.required": "סיסמה היא שדה חובה",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "הסיסמאות אינן תואמות",
    "any.required": "אימות סיסמה הוא שדה חובה",
  }),
  phone: Joi.string().allow("").optional(),
  companyName: Joi.string().allow("").optional(),
  companyId: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
});


export const registerInitialData: RegisterFormType = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  companyName: "",
  companyId: "",
  address: "",
};

export const paymentSchema = Joi.object<PaymentFormType>({
  mockCardNumber: Joi.string().min(4).required().messages({
    "string.empty": "מספר כרטיס הוא שדה חובה",
    "string.min": "מספר כרטיס לא תקין",
    "any.required": "מספר כרטיס הוא שדה חובה",
  }),
});

export const paymentInitialData: PaymentFormType = {
  mockCardNumber: "",
};

export const getPaymentFormInfo = (
  values: PaymentFormType,
  setValue: (key: keyof PaymentFormType, value: string) => void,
  errors: Partial<Record<keyof PaymentFormType, string>> = {}
): FieldConfig[] => [
  { name: "mockCardNumber", label: "מספר כרטיס (לצורך פיתוח)", type: "text", value: values.mockCardNumber, onChange: (v) => setValue("mockCardNumber", v), error: errors.mockCardNumber },
];

export const getRegisterFormInfo = (
  values: RegisterFormType,
  setValue: (key: keyof RegisterFormType, value: string) => void,
  errors: Partial<Record<keyof RegisterFormType, string>> = {}
): FieldConfig[] => [
  { name: "name", label: "שם מלא", type: "text", value: values.name, onChange: (v) => setValue("name", v), error: errors.name },
  { name: "email", label: "אימייל", type: "email", value: values.email, onChange: (v) => setValue("email", v), error: errors.email },
  { name: "password", label: "סיסמה", type: "password", value: values.password, onChange: (v) => setValue("password", v), error: errors.password },
  { name: "confirmPassword", label: "אימות סיסמה", type: "password", value: values.confirmPassword, onChange: (v) => setValue("confirmPassword", v), error: errors.confirmPassword },
  { name: "phone", label: "טלפון", type: "text", value: values.phone, onChange: (v) => setValue("phone", v) },
  { name: "companyName", label: "שם החברה", type: "text", value: values.companyName, onChange: (v) => setValue("companyName", v) },
  { name: "companyId", label: 'ח"פ / עוסק מורשה', type: "text", value: values.companyId, onChange: (v) => setValue("companyId", v) },
  { name: "address", label: "כתובת העסק", type: "text", value: values.address, onChange: (v) => setValue("address", v) },
];

