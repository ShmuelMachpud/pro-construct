import {
  Box, Typography, Chip, Button, TextField, MenuItem,
  Grid, Divider, CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { statusConfig, typeLabels } from "../helpers/projects.helpers";
import { projectTypeOptions, projectStatusOptions } from "../helpers/createProject.helpers";

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, saving, error, editMode, setEditMode, handleCancelEdit, handleSave, values, setValue, errors } =
    useProject(id!);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (!project) return <Typography color="error" sx={{ mt: 4 }}>{error || "פרויקט לא נמצא"}</Typography>;

  const status = statusConfig[project.status];

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("he-IL") : "—";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/projects")} sx={{ color: "grey.400" }}>
            פרויקטים
          </Button>
          <Typography variant="h5" fontWeight="bold" color="white">{project.name}</Typography>
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
        {!editMode
          ? <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>עריכה</Button>
          : <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={handleCancelEdit} sx={{ color: "grey.400" }}>ביטול</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                {saving ? "שומר..." : "שמור"}
              </Button>
            </Box>
        }
      </Box>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      {editMode ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 640 }}>
          <TextField label="שם פרויקט *" fullWidth value={values.name} onChange={(e) => setValue("name", e.target.value)} error={!!errors.name} helperText={errors.name} />
          <TextField label="סוג פרויקט *" fullWidth select value={values.type} onChange={(e) => setValue("type", e.target.value)} error={!!errors.type} helperText={errors.type}>
            {projectTypeOptions.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </TextField>
          <TextField label="מיקום *" fullWidth value={values.location} onChange={(e) => setValue("location", e.target.value)} error={!!errors.location} helperText={errors.location} />
          <TextField label="סטטוס" fullWidth select value={values.status} onChange={(e) => setValue("status", e.target.value)}>
            {projectStatusOptions.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </TextField>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField label="תאריך התחלה" fullWidth type="date" value={values.startDate} onChange={(e) => setValue("startDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField label="תאריך סיום" fullWidth type="date" value={values.endDate} onChange={(e) => setValue("endDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={6}>
              <TextField label='מ"ר' fullWidth type="number" value={values.squareMeters} onChange={(e) => setValue("squareMeters", e.target.value)} />
            </Grid>
            <Grid size={6}>
              <TextField label="מספר היתר" fullWidth value={values.permitNumber} onChange={(e) => setValue("permitNumber", e.target.value)} />
            </Grid>
          </Grid>
          <TextField label="תיאור" fullWidth multiline rows={3} value={values.description} onChange={(e) => setValue("description", e.target.value)} />
          <TextField label="הערות" fullWidth multiline rows={2} value={values.notes} onChange={(e) => setValue("notes", e.target.value)} />
        </Box>
      ) : (
        <Box sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 3, p: 4, maxWidth: 700 }}>
          <Typography color="grey.500" fontSize="0.9rem" mb={3}>{typeLabels[project.type] ?? project.type}</Typography>

          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography color="grey.600" fontSize="0.75rem">מיקום</Typography>
              <Typography color="white">{project.location}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography color="grey.600" fontSize="0.75rem">סטטוס</Typography>
              <Typography color="white">{status?.label ?? project.status}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography color="grey.600" fontSize="0.75rem">תאריך התחלה</Typography>
              <Typography color="white">{formatDate(project.startDate)}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography color="grey.600" fontSize="0.75rem">תאריך סיום</Typography>
              <Typography color="white">{formatDate(project.endDate)}</Typography>
            </Grid>
            {project.squareMeters && (
              <Grid size={6}>
                <Typography color="grey.600" fontSize="0.75rem">מ"ר</Typography>
                <Typography color="white">{project.squareMeters.toLocaleString()}</Typography>
              </Grid>
            )}
            {project.permitNumber && (
              <Grid size={6}>
                <Typography color="grey.600" fontSize="0.75rem">מספר היתר</Typography>
                <Typography color="white">{project.permitNumber}</Typography>
              </Grid>
            )}
          </Grid>

          {project.description && (
            <>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 3 }} />
              <Typography color="grey.600" fontSize="0.75rem" mb={0.5}>תיאור</Typography>
              <Typography color="white">{project.description}</Typography>
            </>
          )}

          {project.notes && (
            <>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 3 }} />
              <Typography color="grey.600" fontSize="0.75rem" mb={0.5}>הערות</Typography>
              <Typography color="white">{project.notes}</Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectPage;
