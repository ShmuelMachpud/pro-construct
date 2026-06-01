import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import type { MaterialCategory, CreateCategoryDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateCategoryDto) => Promise<void>;
  editItem?: MaterialCategory | null;
}

const emptyForm: CreateCategoryDto = { name: "", description: "" };

const CategoryModal = ({ open, onClose, onSave, editItem }: Props) => {
  const [form, setForm] = useState<CreateCategoryDto>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editItem) {
      setForm({ name: editItem.name, description: editItem.description ?? "" });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editItem, open]);

  const handleChange = (field: keyof CreateCategoryDto, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("שם קטגוריה הוא שדה חובה"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({ name: form.name.trim(), description: form.description?.trim() || undefined });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? "שגיאה בשמירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <CategoryIcon sx={{ color: "primary.main" }} />
        {editItem ? "עריכת קטגוריה" : "קטגוריה חדשה"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0.5 }}>
          <TextField
            label="שם קטגוריה *"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="תיאור"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Box>
        {error && <Box sx={{ mt: 1.5, color: "error.main", fontSize: "0.875rem" }}>{error}</Box>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "שומר..." : "שמור"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
