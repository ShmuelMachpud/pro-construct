import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import type { CreateClientDto } from "../types/clients.types";
import { createClient } from "../services/client.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const emptyForm: CreateClientDto = {
  type: "private",
  name: "",
  phone: "",
  email: "",
  address: "",
  billingName: "",
  billingPhone: "",
  billingAddress: "",
};

const CreateClientModal = ({ open, onClose, onCreated }: Props) => {
  const [form, setForm] = useState<CreateClientDto>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof CreateClientDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError("שם וטלפון הם שדות חובה");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createClient(form);
      setForm(emptyForm);
      onCreated();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ? `שגיאה: ${msg}` : "שגיאה ביצירת הלקוח, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    setError("");
    onClose();
  };

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
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="סוג לקוח"
              fullWidth
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <MenuItem value="private">פרטי</MenuItem>
              <MenuItem value="business">עסקי</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="טלפון *"
              fullWidth
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="אימייל"
              fullWidth
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="כתובת"
              fullWidth
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="שם לחשבונית"
              fullWidth
              value={form.billingName}
              onChange={(e) => handleChange("billingName", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="טלפון לחשבונית"
              fullWidth
              multiline
              value={form.billingPhone}
              onChange={(e) => handleChange("billingPhone", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="כתובת לחשבונית"
              fullWidth
              multiline
              value={form.billingAddress}
              onChange={(e) => handleChange("billingAddress", e.target.value)}
            />
          </Grid>
        </Grid>

        {error && (
          <Box sx={{ mt: 2, color: "error.main", fontSize: "0.875rem" }}>{error}</Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "שומר..." : "שמור לקוח"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClientModal;
