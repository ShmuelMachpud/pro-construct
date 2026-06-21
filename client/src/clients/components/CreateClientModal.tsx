import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useCreateClient } from "../hooks/useCreateClient";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateClientModal = ({ open, onClose, onCreated }: Props) => {
  const { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit, handleClose } =
    useCreateClient(onCreated, onClose);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <PersonAddIcon sx={{ color: "primary.main" }} />
        לקוח חדש
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="שם לקוח *"
              fullWidth
              value={values.name}
              onChange={(e) => setValue("name", e.target.value)}
              onBlur={() => onBlur("name")}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="סוג לקוח"
              fullWidth
              value={values.type}
              onChange={(e) => setValue("type", e.target.value)}
            >
              <MenuItem value="private">פרטי</MenuItem>
              <MenuItem value="business">עסקי</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="טלפון *"
              fullWidth
              value={values.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              onBlur={() => onBlur("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="אימייל"
              fullWidth
              value={values.email}
              onChange={(e) => setValue("email", e.target.value)}
              onBlur={() => onBlur("email")}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="כתובת"
              fullWidth
              value={values.address}
              onChange={(e) => setValue("address", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="שם לחשבונית"
              fullWidth
              value={values.billingName}
              onChange={(e) => setValue("billingName", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="טלפון לחשבונית"
              fullWidth
              value={values.billingPhone}
              onChange={(e) => setValue("billingPhone", e.target.value)}
              onBlur={() => onBlur("billingPhone")}
              error={!!errors.billingPhone}
              helperText={errors.billingPhone}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="כתובת לחשבונית"
              fullWidth
              value={values.billingAddress}
              onChange={(e) => setValue("billingAddress", e.target.value)}
            />
          </Grid>
        </Grid>

        {serverError && (
          <Box sx={{ mt: 2, color: "error.main", fontSize: "0.875rem" }}>{serverError}</Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isValid}>
          {loading ? "שומר..." : "שמור לקוח"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

