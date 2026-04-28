import { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, Chip, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { getProjects } from "../services/project.service";
import CreateProjectModal from "../components/CreateProjectModal";
import { useAuth } from "../../global/hooks/useAuth";

const statusLabels: Record<string, { label: string; color: string }> = {
  planning: { label: "תכנון", color: "#757575" },
  in_progress: { label: "בביצוע", color: "#FF6B00" },
  on_hold: { label: "מושהה", color: "#f44336" },
  completed: { label: "הושלם", color: "#4caf50" },
};

const typeLabels: Record<string, string> = {
  new_construction: "בנייה חדשה",
  renovation: "שיפוץ",
  infrastructure: "תשתיות",
  other: "אחר",
};

const ProjectsPage = () => {
  const { isContractor } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <Box>
      {/* כותרת */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">
          פרויקטים
        </Typography>
{isContractor && (
  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
    פרויקט חדש
  </Button>
)}
      </Box>

      {/* כרטיסיות */}
      <Grid container spacing={3}>
        {projects.map((project) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <Card
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
                {/* שורה עליונה */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FolderIcon sx={{ color: "primary.main", fontSize: 22 }} />
                    <Typography fontWeight="bold" color="white" fontSize="1rem">
                      {project.name}
                    </Typography>
                  </Box>
<Chip
  label={statusLabels[project.status]?.label || project.status}
  size="small"
  sx={{
    backgroundColor: `${statusLabels[project.status]?.color}22`,
    color: statusLabels[project.status]?.color,
    fontWeight: "bold",
    border: `1px solid ${statusLabels[project.status]?.color}66`,
  }}
/>
                </Box>
                
                

                {/* סוג פרויקט */}
                <Typography color="grey.500" fontSize="0.85rem" mb={2}>
                  {typeLabels[project.type] || project.type}
                </Typography>

                {/* מיקום */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <LocationOnIcon sx={{ color: "grey.500", fontSize: 16 }} />
                  <Typography color="grey.400" fontSize="0.85rem">
                    {project.city}{project.address ? `, ${project.address}` : ""}
                  </Typography>
                </Box>

                {/* לקוח */}
                {project.client && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                    <PersonIcon sx={{ color: "grey.500", fontSize: 16 }} />
                    <Typography color="grey.400" fontSize="0.85rem">
                      {project.client.name}
                    </Typography>
                  </Box>
                )}

                {/* תקציב */}
                {project.budget && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="grey.500" fontSize="0.8rem">תקציב</Typography>
                    <Typography color="primary.main" fontWeight="bold" fontSize="0.9rem">
                      ₪{Number(project.budget).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isContractor && (
        <CreateProjectModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onCreated={() => getProjects().then(setProjects)}
        />
      )}
    </Box>
  );
};

export default ProjectsPage;