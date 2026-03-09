import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography
} from "@mui/material";
import { useState } from "react";
import { createProject } from "../services/project.service";

const projectTypes = [
  { value: "new_construction", label: "בנייה חדשה" },
  { value: "renovation", label: "שיפוץ" },
  { value: "infrastructure", label: "תשתיות" },
  { value: "other", label: "אחר" },
];

const permitStatuses = [
  { value: "not_required", label: "לא נדרש" },
  { value: "pending", label: "בהמתנה" },
  { value: "approved", label: "אושר" },
  { value: "rejected", label: "נדחה" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateProjectModal = ({ open, onClose, onCreated }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    budget: "",
    permitStatus: "",
    clientId: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.type || !form.city || !form.clientId) {
      setError("שם פרויקט, סוג, עיר ולקוח הם שדות חובה");
      return;
    }

    setLoading(true);
    try {
      await createProject({
        ...form,
        budget: form.budget ? Number(form.budget) : undefined,
        clientId: Number(form.clientId),
        permitStatus: form.permitStatus || undefined,
      });
      onCreated();
      onClose();
      setForm({ name: "", type: "", city: "", address: "", budget: "", permitStatus: "", clientId: "" });
    } catch {
      setError("אירעה שגיאה ביצירת הפרויקט");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1E1E1E",
          border: "1px solid rgba(255,107,0,0.2)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color="white">
          פרויקט חדש
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="שם פרויקט *"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            label="סוג פרויקט *"
            fullWidth
            select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            {projectTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="עיר *"
            fullWidth
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <TextField
            label="כתובת"
            fullWidth
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <TextField
            label="תקציב מאושר"
            fullWidth
            type="number"
            value={form.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
          />

          <TextField
            label="מצב היתרי בנייה"
            fullWidth
            select
            value={form.permitStatus}
            onChange={(e) => handleChange("permitStatus", e.target.value)}
          >
            {permitStatuses.map((p) => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="מזהה לקוח *"
            fullWidth
            type="number"
            value={form.clientId}
            onChange={(e) => handleChange("clientId", e.target.value)}
          />

          {error && (
            <Typography color="error" fontSize="0.9rem">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "grey.400" }}>
          ביטול
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "יוצר..." : "צור פרויקט"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;