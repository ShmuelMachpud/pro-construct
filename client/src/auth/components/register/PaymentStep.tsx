import { Construction } from "@mui/icons-material";
import GenericForm from "../../../global/components/GenericForm";
import { getPaymentFormInfo } from "../../helpers/register.helpers";
import { cardSx } from "../../helpers/register.styles";
import type { PaymentFormType } from "../../types/auth.types";

interface PaymentStepProps {
  values: PaymentFormType;
  setValue: (key: keyof PaymentFormType, value: string) => void;
  errors: Partial<Record<keyof PaymentFormType, string>>;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

const PaymentStep = ({ values, setValue, errors, onSubmit, loading, error }: PaymentStepProps) => (
  <GenericForm
    title="פרטי תשלום"
    subtitle="הכרטיס יחויב רק לאחר אישור חשבונך"
    icon={<Construction sx={{ color: "primary.main", fontSize: 36 }} />}
    infoForm={getPaymentFormInfo(values, setValue, errors)}
    onSubmit={onSubmit}
    submitLabel="שמור פרטי תשלום"
    loading={loading}
    error={error}
    sx={cardSx}
  />
);

export default PaymentStep;
