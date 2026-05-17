import { useState } from "react";
import type Joi from "joi";

type FormValues = Record<string, string>;

export const useForm = <T extends FormValues>(initial: T) => {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (schema: Joi.ObjectSchema): boolean => {
    const result = schema.validate(values, { abortEarly: false });
    if (!result.error) {
      setErrors({});
      return true;
    }
    const newErrors: Partial<Record<keyof T, string>> = {};
    result.error.details.forEach((detail) => {
      const key = detail.path[0] as keyof T;
      if (!newErrors[key]) newErrors[key] = detail.message;
    });
    setErrors(newErrors);
    return false;
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, setValue, errors, validate, reset };
};
