import { useState } from "react";
import { isAxiosError } from "axios";
import { checkEmailAvailable, register } from "../services/auth.service";
import { useForm } from "../../global/hooks/useForm";
import {
  registerInitialData,
  registerSchema,
} from "../helpers/register.helpers";
import type { RegisterFormType, RegisterPlan } from "../types/auth.types";
import { createSubscription } from "../../paypal/services/paypal.service";

type Step = "register" | "payment" | "done";

const registerErrorMessage = (err: unknown): string => {
  if (isAxiosError(err) && err.response?.status === 409)
    return "כתובת האימייל כבר רשומה במערכת.";
  return "ההרשמה נכשלה. נסה שנית.";
};

// Registration is a multi-step wizard: "register" -> "payment" -> "done".
// The user account is only created AFTER PayPal approves the subscription,
// so no unpaid accounts ever reach the database.
export const useRegister = () => {
  const [step, setStep] = useState<Step>("register");
  const [plan, setPlan] = useState<RegisterPlan>("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Set once PayPal approved the payment. If account creation fails
  // afterwards, we retry with this id instead of charging the user again.
  const [approvedSubscriptionId, setApprovedSubscriptionId] = useState("");

  const registerForm = useForm<RegisterFormType>(registerInitialData);

  // Step 1: validate the form and verify the email is available,
  // BEFORE the user pays — a taken email must never reach payment
  const handleRegister = async () => {
    if (!registerForm.validate(registerSchema)) return;
    setError("");
    setLoading(true);
    try {
      const available = await checkEmailAvailable(registerForm.values.email);
      if (!available) {
        registerForm.setFieldError("email", "כתובת האימייל כבר רשומה במערכת");
        return;
      }
      setStep("payment");
    } catch {
      setError("לא ניתן לאמת את כתובת האימייל כרגע. נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  // Called by the PayPal button to start a subscription on our server.
  // Maps the selected UI plan to the PayPal billing interval
  const handleCreateSubscription = async () => {
    const interval = plan === "monthly" ? "MONTH" : "YEAR";
    const subscriptionId = await createSubscription(interval);
    return subscriptionId;
  };

  const submitRegistration = async (subscriptionId: string) => {
    setError("");
    setLoading(true);
    try {
      await register(registerForm.values, plan, subscriptionId);
      setStep("done"); // show "pending admin approval" success screen
    } catch (err) {
      setError(registerErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Called by PayPal only after the user approved the payment.
  // The approved subscriptionId is stored as the user's payment token
  const handlePayPalApprove = async (subscriptionId: string) => {
    setApprovedSubscriptionId(subscriptionId);
    await submitRegistration(subscriptionId);
  };

  // Retry account creation with the already-approved subscription —
  // never re-opens PayPal, so the user is never charged twice
  const handleRetryRegister = () => submitRegistration(approvedSubscriptionId);

  const handlePayPalError = () =>
    setError("אירעה שגיאה בתהליך התשלום. נסה שנית.");

  return {
    step,
    plan,
    setPlan,
    registerForm,
    error,
    loading,
    paymentApproved: Boolean(approvedSubscriptionId),
    handleRegister,
    handleCreateSubscription,
    handlePayPalApprove,
    handleRetryRegister,
    handlePayPalError,
  };
};
