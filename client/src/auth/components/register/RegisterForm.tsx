import { useRegister } from "../../hooks/useRegister";
import RegistrationStep from "./RegistrationStep";
import PaymentStep from "./PaymentStep";
import SuccessStep from "./SuccessStep";

const RegisterForm = () => {
  const { step, plan, setPlan, registerForm, paymentForm, error, loading, handleRegister, handlePaymentSubmit } = useRegister();

  if (step === "done") return <SuccessStep plan={plan} />;

  if (step === "payment")
    return (
      <PaymentStep
        values={paymentForm.values}
        setValue={paymentForm.setValue}
        errors={paymentForm.errors}
        onSubmit={handlePaymentSubmit}
        loading={loading}
        error={error}
      />
    );

  return (
    <RegistrationStep
      values={registerForm.values}
      setValue={registerForm.setValue}
      errors={registerForm.errors}
      plan={plan}
      onPlanChange={setPlan}
      onSubmit={handleRegister}
      loading={loading}
      error={error}
    />
  );
};

export default RegisterForm;
