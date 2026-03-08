import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getProjects } from "../services/project.service";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          פרויקטים
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          פרויקט חדש
        </Button>
      </Box>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </Box>
  );
};

export default ProjectsPage;