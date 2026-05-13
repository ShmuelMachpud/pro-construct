import { Construction } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import GenericForm from "../../global/components/GenericForm";
import { useRegister } from "../hooks/useRegister";
import { getRegisterFormInfo } from "../helpers/register.helpers";

const RegisterForm = () => {
  const { values, setValue, error, loading, handleRegister } = useRegister();

  return (
    <GenericForm
      title="ProConstruct"
      subtitle="יצירת חשבון חדש"
      icon={<Construction sx={{ color: "primary.main", fontSize: 36 }} />}
      infoForm={getRegisterFormInfo(values, setValue)}
      onSubmit={handleRegister}
      submitLabel="הרשמה"
      loading={loading}
      error={error}
      footer={
        <Typography variant="body2" color="grey.400">
          כבר יש לך חשבון?{" "}
          <Link to="/login" style={{ color: "#FF6B00" }}>התחבר כאן</Link>
        </Typography>
      }
      sx={{
        p: 5,
        width: 420,
        backgroundColor: "rgba(30,30,30,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,107,0,0.3)",
        borderRadius: 3,
      }}
    />
  );
};

export default RegisterForm;
