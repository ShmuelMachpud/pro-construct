import { TextField, Grid, Box, MenuItem, CircularProgress } from "@mui/material";
import type { UseFormReturn } from "../../global/hooks/useForm";
import type { CreateQuoteFormType } from "../helpers/createQuote.helpers";
import type { Project } from "../../projects/types/projects.types";

interface Props {
  form: UseFormReturn<CreateQuoteFormType>;
  projects: Project[];
  projectsLoading: boolean;
  fixedProjectId?: string;
  serverError: string;
}

export const QuoteDetailsStep = ({ form, projects, projectsLoading, fixedProjectId, serverError }: Props) => (
  <Grid container spacing={2} sx={{ mt: 0.5 }}>
    {!fixedProjectId && (
      <Grid size={{ xs: 12 }}>
        <TextField
          select
          label="פרויקט *"
          fullWidth
          value={form.values.projectId}
          onChange={(e) => form.setValue("projectId", e.target.value)}
          onBlur={() => form.onBlur("projectId")}
          error={!!form.errors.projectId}
          helperText={form.errors.projectId}
          disabled={projectsLoading}
          slotProps={projectsLoading ? { input: { startAdornment: <CircularProgress size={16} sx={{ mr: 1 }} /> } } : undefined}
        >
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>
      </Grid>
    )}

    <Grid size={{ xs: 12 }}>
      <TextField
        label="כותרת *"
        fullWidth
        value={form.values.title}
        onChange={(e) => form.setValue("title", e.target.value)}
        onBlur={() => form.onBlur("title")}
        error={!!form.errors.title}
        helperText={form.errors.title}
        autoFocus
      />
    </Grid>

    <Grid size={{ xs: 12 }}>
      <TextField
        label="תאריך תפוגה"
        fullWidth
        type="date"
        value={form.values.validUntil}
        onChange={(e) => form.setValue("validUntil", e.target.value)}
        onBlur={() => form.onBlur("validUntil")}
        error={!!form.errors.validUntil}
        helperText={form.errors.validUntil}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Grid>

    <Grid size={{ xs: 12 }}>
      <TextField
        label="הערות"
        fullWidth
        multiline
        rows={2}
        value={form.values.notes}
        onChange={(e) => form.setValue("notes", e.target.value)}
      />
    </Grid>

    {serverError && (
      <Grid size={{ xs: 12 }}>
        <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{serverError}</Box>
      </Grid>
    )}
  </Grid>
);
