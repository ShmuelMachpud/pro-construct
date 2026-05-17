import { Construction } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import GenericForm from "../../global/components/GenericForm";
import { useLogin } from "../hooks/useLogin";
import { getLoginFormInfo } from "../helpers/login.helpers";

const LoginForm = () => {
  const { values, setValue, errors, error, loading, handleLogin } = useLogin();

  return (
    <GenericForm
      title="ProConstruct"
      subtitle="התחברות למערכת"
      icon={<Construction sx={{ color: "primary.main", fontSize: 36 }} />}
      infoForm={getLoginFormInfo(values, setValue, errors)}
      onSubmit={handleLogin}
      submitLabel="התחבר"
      loading={loading}
      error={error}
      footer={
        <Typography variant="body2" color="grey.400">
          אין לך חשבון?{" "}
          <Link to="/register" style={{ color: "#FF6B00" }}>הירשם כאן</Link>
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

export default LoginForm;
