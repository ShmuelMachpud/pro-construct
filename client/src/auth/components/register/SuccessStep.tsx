import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { cardSx } from "../../helpers/register.styles";
import type { RegisterPlan } from "../../types/auth.types";

interface SuccessStepProps {
  plan: RegisterPlan;
}

const SuccessStep = ({ plan }: SuccessStepProps) => (
  <Box sx={{ ...cardSx, textAlign: "center" }}>
    <CheckCircleOutline sx={{ fontSize: 56, color: "primary.main", mb: 2 }} />
    <Typography variant="h6" fontWeight={700} mb={1}>ההרשמה הושלמה!</Typography>
    <Typography variant="body2" color="grey.400" mb={3}>
      {plan === "annual"
        ? "פרטי התשלום נשמרו. המנוי השנתי (1,000 ₪/שנה) יופעל ברגע שחשבונך יאושר."
        : "פרטי התשלום נשמרו. המנוי החודשי (99 ₪/חודש) יופעל ברגע שחשבונך יאושר."}
    </Typography>
    <Typography variant="body2" color="grey.400">
      <Link to="/login" style={{ color: "#FF6B00" }}>חזרה להתחברות</Link>
    </Typography>
  </Box>
);

export default SuccessStep;
