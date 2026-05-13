import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Construction } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 240;

const adminMenuItems = [
  { label: "משתמשים", icon: <PeopleIcon />, path: "/users" },
  { label: "סטטיסטיקות", icon: <BarChartIcon />, path: "/statistics" },
];

const contractorMenuItems = [
  { label: "פרויקטים", icon: <FolderIcon />, path: "/projects" },
  { label: "לקוחות", icon: <PeopleIcon />, path: "/clients" },
  { label: "הצעות מחיר", icon: <ReceiptIcon />, path: "/quotes" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = isAdmin ? adminMenuItems : contractorMenuItems;

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        minWidth: DRAWER_WIDTH,
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
        borderLeft: "1px solid rgba(255,107,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <Construction sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="white">
          Pro<span style={{ color: "#FF6B00" }}>Construct</span>
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,107,0,0.2)" }} />

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(255,107,0,0.15)",
                borderRight: "3px solid #FF6B00",
                "& .MuiListItemIcon-root": { color: "#FF6B00" },
                "& .MuiListItemText-primary": { color: "#FF6B00", fontWeight: "bold" },
              },
              "&:hover": {
                backgroundColor: "rgba(255,107,0,0.08)",
              },
              color: "grey.400",
            }}
          >
            <ListItemIcon sx={{ color: "grey.400", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
