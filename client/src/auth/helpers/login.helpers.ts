import type { FieldConfig } from "../../global/components/GenericForm";
import type { LoginFormType } from "../types/auth.types";

export const loginInitialData: LoginFormType = {
  email: "",
  password: "",
};

export const getLoginFormInfo = (
  values: LoginFormType,
  setValue: (key: keyof LoginFormType, value: string) => void
): FieldConfig[] => [
  { name: "email", label: "אימייל", type: "email", value: values.email, onChange: (v) => setValue("email", v) },
  { name: "password", label: "סיסמה", type: "password", value: values.password, onChange: (v) => setValue("password", v) },
];
