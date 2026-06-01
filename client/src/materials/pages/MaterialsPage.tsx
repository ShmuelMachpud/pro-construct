import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import CategoriesTab from "../components/CategoriesTab";
import GlobalMaterialsTab from "../components/GlobalMaterialsTab";

const MaterialsPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="white" mb={2}>
        ניהול חומרים
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
        <Tab label="קטגוריות" />
        <Tab label="חומרים" />
      </Tabs>

      {tab === 0 ? <CategoriesTab /> : <GlobalMaterialsTab />}
    </Box>
  );
};

export default MaterialsPage;
