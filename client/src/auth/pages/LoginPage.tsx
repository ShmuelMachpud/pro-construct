import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Construction } from "@mui/icons-material";
import { login } from "../services/auth.service";

const BG_IMAGE = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("אימייל או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

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
      {/* Overlay כהה */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      />

      {/* כרטיס לוגין */}
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
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: 420,
            backgroundColor: "rgba(30,30,30,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,107,0,0.3)",
            borderRadius: 3,
          }}
        >
          {/* לוגו */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 4 }}>
            <Construction sx={{ color: "primary.main", fontSize: 36 }} />
            <Typography variant="h4" fontWeight="bold" color="white">
              Pro<span style={{ color: "#FF6B00" }}>Construct</span>
            </Typography>
          </Box>

          <Typography variant="h6" textAlign="center" color="grey.400" mb={4}>
            התחברות למערכת
          </Typography>

          <TextField
            fullWidth
            label="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="סיסמה"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" textAlign="center" mt={1} fontSize="0.9rem">
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? "מתחבר..." : "התחבר"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;