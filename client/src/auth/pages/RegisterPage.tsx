import { Box } from "@mui/material";
import RegisterForm from "../components/RegisterForm";

const BG_IMAGE = "/proconstruct.jpg";

const RegisterPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.7)" }} />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default RegisterPage;
