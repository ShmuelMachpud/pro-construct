import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import PendingUsersTable from "../components/PendingUsersTable";
import AllUsersTable from "../components/AllUsersTable";

const UsersPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="white" mb={2}>
        ניהול משתמשים
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        sx={{
          mb: 3,
          borderBottom: "1px solid rgba(255,107,0,0.2)",
          "& .MuiTab-root": { color: "grey.500" },
          "& .Mui-selected": { color: "#FF6B00" },
          "& .MuiTabs-indicator": { backgroundColor: "#FF6B00" },
        }}
      >
        <Tab label="כל המשתמשים" />
        <Tab label="ממתינים לאישור" />
      </Tabs>
      {tab === 0 ?  <AllUsersTable /> : <PendingUsersTable /> }
    </Box>
  );
};

export default UsersPage;
