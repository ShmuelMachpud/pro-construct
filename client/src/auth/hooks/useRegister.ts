import { useState } from "react";
import { register } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import { registerInitialData, paymentInitialData, registerSchema, paymentSchema } from "../helpers/register.helpers";
import type { RegisterFormType, PaymentFormType, RegisterPlan } from "../types/auth.types";

type Step = "register" | "payment" | "done";

export const useRegister = () => {
  const [step, setStep] = useState<Step>("register");
  const [plan, setPlan] = useState<RegisterPlan>("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerForm = useForm<RegisterFormType>(registerInitialData);
  const paymentForm = useForm<PaymentFormType>(paymentInitialData);

  const handleRegister = () => {
    if (!registerForm.validate(registerSchema)) return;
    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.validate(paymentSchema)) return;

    setError("");
    setLoading(true);
    try {
      await register(registerForm.values, plan, paymentForm.values.mockCardNumber);
      setStep("done");
    } catch {
      setError("ההרשמה נכשלה. נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    plan,
    setPlan,
    registerForm,
    paymentForm,
    error,
    loading,
    handleRegister,
    handlePaymentSubmit,
  };
};
