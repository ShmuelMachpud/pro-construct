import type { FieldConfig } from "../../global/components/GenericForm";
import type { RegisterFormType } from "../types/auth.types";

export const registerInitialData: RegisterFormType = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const getRegisterFormInfo = (
  values: RegisterFormType,
  setValue: (key: keyof RegisterFormType, value: string) => void
): FieldConfig[] => [
  { name: "name", label: "שם מלא", type: "text", value: values.name, onChange: (v) => setValue("name", v) },
  { name: "email", label: "אימייל", type: "email", value: values.email, onChange: (v) => setValue("email", v) },
  { name: "password", label: "סיסמה", type: "password", value: values.password, onChange: (v) => setValue("password", v) },
  { name: "confirmPassword", label: "אימות סיסמה", type: "password", value: values.confirmPassword, onChange: (v) => setValue("confirmPassword", v) },
];
