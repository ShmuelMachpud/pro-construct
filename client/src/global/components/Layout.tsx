import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden", backgroundColor: "#121212" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, minHeight: 0, overflow: "auto", p: 3, backgroundColor: "#121212" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;