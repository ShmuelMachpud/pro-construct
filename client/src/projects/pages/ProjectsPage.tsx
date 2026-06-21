import { Box, Button, Typography, Card, CardContent, Chip, Grid, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../../global/hooks/useAuth";
import { statusConfig, typeLabels } from "../helpers/projects.helpers";
import CreateProjectModal from "../components/CreateProjectModal";

const ProjectsPage = () => {
  const { isContractor } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, fetchProjects } = useProjects();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">פרויקטים</Typography>
        {isContractor && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)}>
            פרויקט חדש
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : projects.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <FolderOpenIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography>אין פרויקטים עדיין. הוסף פרויקט חדש להתחיל.</Typography>
        </Box>
      ) : (
      <Grid container spacing={3}>
        {projects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <Card
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  backgroundColor: "#1E1E1E",
                  border: "1px solid rgba(255,107,0,0.15)",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    border: "1px solid rgba(255,107,0,0.5)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(255,107,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FolderIcon sx={{ color: "primary.main", fontSize: 22 }} />
                      <Typography fontWeight="bold" color="white" fontSize="1rem">{project.name}</Typography>
                    </Box>
                    <Chip
                      label={status?.label ?? project.status}
                      size="small"
                      sx={{
                        backgroundColor: `${status?.color}22`,
                        color: status?.color,
                        fontWeight: "bold",
                        border: `1px solid ${status?.color}66`,
                      }}
                    />
                  </Box>
                  <Typography color="grey.500" fontSize="0.85rem" mb={2}>{typeLabels[project.type] ?? project.type}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnIcon sx={{ color: "grey.500", fontSize: 16 }} />
                    <Typography color="grey.400" fontSize="0.85rem">{project.location}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      )}

      {isContractor && (
        <CreateProjectModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreated={() => { fetchProjects(); setOpenCreateModal(false); }}
        />
      )}
    </Box>
  );
};

export default ProjectsPage;
