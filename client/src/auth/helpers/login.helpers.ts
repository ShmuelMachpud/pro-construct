import Joi from "joi";
import type { FieldConfig } from "../../global/components/GenericForm";
import type { LoginFormType } from "../types/auth.types";

export const loginSchema = Joi.object<LoginFormType>({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "אימייל הוא שדה חובה",
    "string.email": "כתובת אימייל לא תקינה",
    "any.required": "אימייל הוא שדה חובה",
  }),
  password: Joi.string().required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "any.required": "סיסמה היא שדה חובה",
  }),
});

export const loginInitialData: LoginFormType = {
  email: "",
  password: "",
};

export const getLoginFormInfo = (
  values: LoginFormType,
  setValue: (key: keyof LoginFormType, value: string) => void,
  errors: Partial<Record<keyof LoginFormType, string>> = {}
): FieldConfig[] => [
  { name: "email", label: "אימייל", type: "email", value: values.email, onChange: (v) => setValue("email", v), error: errors.email },
  { name: "password", label: "סיסמה", type: "password", value: values.password, onChange: (v) => setValue("password", v), error: errors.password },
];
