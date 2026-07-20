import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { login } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import { loginInitialData, loginSchema } from "../helpers/login.helpers";
import type { LoginFormType } from "../types/auth.types";

const loginErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    // Unapproved contractor — valid credentials, account awaiting admin approval
    if (err.response?.status === 403)
      return "החשבון שלך עדיין ממתין לאישור מנהל. תקבל גישה ברגע שהחשבון יאושר.";
    if (err.response?.status === 401) return "אימייל או סיסמה שגויים";
  }
  return "ההתחברות נכשלה. נסה שנית.";
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { values, setValue, errors, validate } =
    useForm<LoginFormType>(loginInitialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validate(loginSchema)) return;

    setError("");
    setLoading(true);
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, error, loading, handleLogin };
};
