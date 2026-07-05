import { useState } from "react";
import { register } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import {
  registerInitialData,
  registerSchema,
} from "../helpers/register.helpers";
import type { RegisterFormType, RegisterPlan } from "../types/auth.types";
import { createSubscription } from "../../paypal/services/paypal.service";

type Step = "register" | "payment" | "done";

// Registration is a multi-step wizard: "register" -> "payment" -> "done".
// The user account is only created AFTER PayPal approves the subscription,
// so no unpaid accounts ever reach the database.
export const useRegister = () => {
  const [step, setStep] = useState<Step>("register");
  const [plan, setPlan] = useState<RegisterPlan>("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerForm = useForm<RegisterFormType>(registerInitialData);

  // Step 1: validate the registration form, then move to payment
  const handleRegister = () => {
    if (!registerForm.validate(registerSchema)) return;
    setStep("payment");
  };

  // Called by the PayPal button to start a subscription on our server.
  // Maps the selected UI plan to the PayPal billing interval
  const handleCreateSubscription = async () => {
    const interval = plan === "monthly" ? "MONTH" : "YEAR";
    const subscriptionId = await createSubscription(interval);
    return subscriptionId;
  };
  // Called by PayPal only after the user approved the payment.
  // The approved subscriptionId is stored as the user's payment token
  const handlePayPalApprove = async (subscriptionId: string) => {
    setError("");
    setLoading(true);
    try {
      await register(registerForm.values, plan, subscriptionId);
      setStep("done"); // show "pending admin approval" success screen
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
    error,
    loading,
    handleRegister,
    handleCreateSubscription,
    handlePayPalApprove,
  };
};
