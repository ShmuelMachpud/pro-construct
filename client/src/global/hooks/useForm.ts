import { useState } from "react";

type FormValues = Record<string, string>;
type ValidationRules<T extends FormValues> = Partial<Record<keyof T, (value: string) => string | undefined>>;

export const useForm = <T extends FormValues>(initial: T) => {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (rules: ValidationRules<T>): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;

    for (const key in rules) {
      const error = rules[key]?.(values[key] ?? "");
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, setValue, errors, validate, reset };
};
