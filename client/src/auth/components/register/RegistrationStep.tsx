import { Construction } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import GenericForm from "../../../global/components/GenericForm";
import PlanSelector from "./PlanSelector";
import { getRegisterFormInfo } from "../../helpers/register.helpers";
import { cardSx } from "../../helpers/register.styles";
import type { RegisterFormType, RegisterPlan } from "../../types/auth.types";

interface RegistrationStepProps {
  values: RegisterFormType;
  setValue: (key: keyof RegisterFormType, value: string) => void;
  errors: Partial<Record<keyof RegisterFormType, string>>;
  plan: RegisterPlan;
  onPlanChange: (plan: RegisterPlan) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

const RegistrationStep = ({ values, setValue, errors, plan, onPlanChange, onSubmit, loading, error }: RegistrationStepProps) => (
  <GenericForm
    title="ProConstruct"
    subtitle="יצירת חשבון חדש"
    icon={<Construction sx={{ color: "primary.main", fontSize: 36 }} />}
    infoForm={getRegisterFormInfo(values, setValue, errors)}
    onSubmit={onSubmit}
    submitLabel="המשך"
    loading={loading}
    error={error}
    beforeSubmit={<PlanSelector value={plan} onChange={onPlanChange} />}
    footer={
      <Typography variant="body2" color="grey.400" textAlign="center">
        כבר יש לך חשבון?{" "}
        <Link to="/login" style={{ color: "#FF6B00" }}>התחבר כאן</Link>
      </Typography>
    }
    sx={cardSx}
  />
);

export default RegistrationStep;
