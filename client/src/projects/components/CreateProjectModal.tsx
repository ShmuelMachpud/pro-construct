import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography, CircularProgress,
} from "@mui/material";
import { useCreateProject } from "../hooks/useCreateProject";
import { projectTypeOptions, projectStatusOptions } from "../helpers/createProject.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateProjectModal = ({ open, onClose, onCreated }: Props) => {
  const { values, setValue, setDateValue, errors, onBlur, isValid, clients, loadingClients, loading, serverError, handleSubmit, handleClose } =
    useCreateProject(open, onCreated, onClose);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color="white">פרויקט חדש</Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="שם פרויקט *"
            fullWidth
            value={values.name}
            onChange={(e) => setValue("name", e.target.value)}
            onBlur={() => onBlur("name")}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="סוג פרויקט *"
            fullWidth
            select
            value={values.type}
            onChange={(e) => setValue("type", e.target.value)}
            onBlur={() => onBlur("type")}
            error={!!errors.type}
            helperText={errors.type}
          >
            {projectTypeOptions.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="מיקום *"
            fullWidth
            value={values.location}
            onChange={(e) => setValue("location", e.target.value)}
            onBlur={() => onBlur("location")}
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            label="לקוח *"
            fullWidth
            select
            value={values.clientId}
            onChange={(e) => setValue("clientId", e.target.value)}
            onBlur={() => onBlur("clientId")}
            error={!!errors.clientId}
            helperText={errors.clientId}
            disabled={loadingClients}
            slotProps={loadingClients ? { input: { endAdornment: <CircularProgress size={18} /> } } : undefined}
          >
            {clients.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="סטטוס"
            fullWidth
            select
            value={values.status}
            onChange={(e) => setValue("status", e.target.value)}
          >
            <MenuItem value="">ללא</MenuItem>
            {projectStatusOptions.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="תאריך התחלה"
            fullWidth
            type="date"
            value={values.startDate}
            onChange={(e) => setDateValue("startDate", e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="תאריך סיום"
            fullWidth
            type="date"
            value={values.endDate}
            onChange={(e) => setDateValue("endDate", e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="תיאור"
            fullWidth
            multiline
            rows={3}
            value={values.description}
            onChange={(e) => setValue("description", e.target.value)}
          />

          <TextField
            label='מ"ר'
            fullWidth
            type="number"
            value={values.squareMeters}
            onChange={(e) => setValue("squareMeters", e.target.value)}
          />

          <TextField
            label="מספר היתר"
            fullWidth
            value={values.permitNumber}
            onChange={(e) => setValue("permitNumber", e.target.value)}
          />

          <TextField
            label="הערות"
            fullWidth
            multiline
            rows={2}
            value={values.notes}
            onChange={(e) => setValue("notes", e.target.value)}
          />

          {serverError && (
            <Typography color="error" fontSize="0.9rem">{serverError}</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} sx={{ color: "grey.400" }}>ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isValid}>
          {loading ? "יוצר..." : "צור פרויקט"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

