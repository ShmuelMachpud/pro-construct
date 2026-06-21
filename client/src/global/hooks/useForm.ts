import { useState } from "react";
import type Joi from "joi";

type FormValues = Record<string, string>;

export const useForm = <T extends FormValues>(initial: T, schema?: Joi.ObjectSchema<T>) => {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onBlur = (key: keyof T) => {
    if (!schema) return;
    const result = schema.extract(key as string).validate(values[key]);
    setErrors((prev) => ({ ...prev, [key]: result.error?.message }));
  };

  const isValid = schema ? !schema.validate(values, { abortEarly: true }).error : true;

  const validate = (overrideSchema?: Joi.ObjectSchema<T>): boolean => {
    const s = overrideSchema ?? schema;
    if (!s) return true;
    const result = s.validate(values, { abortEarly: false });
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

  const setFieldError = (key: keyof T, message: string | undefined) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  const resetTo = (newValues: T) => {
    setValues(newValues);
    setErrors({});
  };

  return { values, setValue, errors, setFieldError, onBlur, isValid, validate, reset, resetTo };
};

export type UseFormReturn<T extends FormValues> = ReturnType<typeof useForm<T>>;
