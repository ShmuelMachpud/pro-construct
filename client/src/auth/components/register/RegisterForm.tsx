import { useRegister } from "../../hooks/useRegister";
import RegistrationStep from "./RegistrationStep";
import PaymentForm from "../../../payment/components/PaymentForm";
import SuccessStep from "./SuccessStep";

const RegisterForm = () => {
  const { step, plan, setPlan, registerForm, error, loading, handleRegister, handleCreateSubscription, handlePayPalApprove } = useRegister();

  if (step === "done") return <SuccessStep plan={plan} />;

  if (step === "payment")
    return (
      <PaymentForm
      onCreateSubscription={handleCreateSubscription}
        onApprove={handlePayPalApprove}
        // values={paymentForm.values}
        // setValue={paymentForm.setValue}
        // errors={paymentForm.errors}
        // onSubmit={handlePaymentSubmit}
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
