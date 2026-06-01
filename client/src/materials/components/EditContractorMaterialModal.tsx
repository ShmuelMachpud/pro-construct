import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Grid, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { ContractorMaterial, UpdateContractorMaterialDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, dto: UpdateContractorMaterialDto) => Promise<void>;
  editItem: ContractorMaterial | null;
}

const EditContractorMaterialModal = ({ open, onClose, onSave, editItem }: Props) => {
  const [form, setForm] = useState({ price: "", supplier: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editItem) {
      setForm({
        price: editItem.price != null ? String(editItem.price) : "",
        supplier: editItem.supplier ?? "",
        notes: editItem.notes ?? "",
      });
    }
    setError("");
  }, [editItem, open]);

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!editItem) return;
    setLoading(true);
    setError("");
    try {
      await onSave(editItem.id, {
        price: form.price ? Number(form.price) : undefined,
        supplier: form.supplier.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? "שגיאה בעדכון, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <EditIcon sx={{ color: "primary.main" }} />
        עריכת חומר
      </DialogTitle>

      <DialogContent>
        {editItem && (
          <Box sx={{ mb: 2, p: 1.5, backgroundColor: "rgba(255,107,0,0.06)", borderRadius: 2 }}>
            <Typography color="white" fontWeight="bold">{editItem.globalMaterial.name}</Typography>
            <Typography color="grey.500" fontSize="0.8rem">
              {editItem.globalMaterial.category.name} · {editItem.globalMaterial.unit}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="מחיר ליחידה"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="ספק"
              fullWidth
              value={form.supplier}
              onChange={(e) => handleChange("supplier", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="הערות"
              fullWidth
              multiline
              rows={2}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
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

export default EditContractorMaterialModal;
