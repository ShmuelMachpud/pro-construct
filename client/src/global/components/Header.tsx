import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from "@mui/material";
import { Logout, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/model/routes.model";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(`/${ROUTES.LOGIN}`);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#1A1A1A",
        borderBottom: "1px solid rgba(255,107,0,0.2)",
      }}
    >
    <Toolbar sx={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountCircle sx={{ color: "grey.400" }} />
          <Typography color="grey.400" fontSize="0.9rem">
            שלום, משתמש
          </Typography>
        </Box>
        <Tooltip title="התנתקות">
          <IconButton onClick={handleLogout} sx={{ color: "grey.400", "&:hover": { color: "primary.main" } }}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;