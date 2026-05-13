import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import { loginInitialData } from "../helpers/login.helpers";
import type { LoginFormType } from "../types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const { values, setValue, errors } = useForm<LoginFormType>(loginInitialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  return { values, setValue, errors, error, loading, handleLogin };
};
