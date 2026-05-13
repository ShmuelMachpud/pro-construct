import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import { registerInitialData } from "../helpers/register.helpers";
import type { RegisterFormType } from "../types/auth.types";

export const useRegister = () => {
  const navigate = useNavigate();
  const { values, setValue, errors, validate } = useForm<RegisterFormType>(registerInitialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const valid = validate({
      name: (v) => !v ? "שם מלא הוא שדה חובה" : undefined,
      email: (v) => !v ? "אימייל הוא שדה חובה" : undefined,
      password: (v) => v.length < 6 ? "סיסמה חייבת להכיל לפחות 6 תווים" : undefined,
      confirmPassword: (v) => v !== values.password ? "הסיסמאות אינן תואמות" : undefined,
    });
    if (!valid) return;

    setError("");
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      navigate("/login");
    } catch {
      setError("ההרשמה נכשלה, נסה שנית");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, error, loading, handleRegister };
};
