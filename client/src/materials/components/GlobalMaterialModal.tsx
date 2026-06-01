import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import type {
  GlobalMaterial,
  MaterialCategory,
  CreateGlobalMaterialDto,
} from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateGlobalMaterialDto) => Promise<void>;
  categories: MaterialCategory[];
  editItem?: GlobalMaterial | null;
}

const emptyForm: CreateGlobalMaterialDto = {
  name: "",
  categoryId: 0,
  unit: "",
  description: "",
};

const GlobalMaterialModal = ({ open, onClose, onSave, categories, editItem }: Props) => {
  const [form, setForm] = useState<CreateGlobalMaterialDto>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name,
        categoryId: editItem.categoryId,
        unit: editItem.unit,
        description: editItem.description ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editItem, open]);

  const handleChange = (field: keyof CreateGlobalMaterialDto, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("שם חומר הוא שדה חובה"); return; }
    if (!form.categoryId) { setError("יש לבחור קטגוריה"); return; }
    if (!form.unit.trim()) { setError("יחידת מידה היא שדה חובה"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({
        name: form.name.trim(),
        categoryId: form.categoryId,
        unit: form.unit.trim(),
        description: form.description?.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? "שגיאה בשמירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <InventoryIcon sx={{ color: "primary.main" }} />
        {editItem ? "עריכת חומר" : "חומר חדש"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="שם חומר *"
              fullWidth
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="קטגוריה *"
              fullWidth
              value={form.categoryId || ""}
              onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="יחידת מידה *"
              fullWidth
              placeholder="מ&quot;ר, מ&quot;ל, יח&apos;..."
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="תיאור"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>
        </Grid>

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

export default GlobalMaterialModal;
