import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import type {
  GlobalMaterial,
  MaterialCategory,
  AddContractorMaterialDto,
} from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: AddContractorMaterialDto) => Promise<void>;
  globalMaterials: GlobalMaterial[];
  categories: MaterialCategory[];
}

const emptyForm = {
  globalMaterialId: 0,
  price: "",
  supplier: "",
  notes: "",
};

const AddContractorMaterialModal = ({
  open, onClose, onSave, globalMaterials, categories,
}: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setForm(emptyForm); setSelectedCategoryId(0); setError(""); }
  }, [open]);

  const handleChange = (field: keyof typeof emptyForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const filteredMaterials = selectedCategoryId
    ? globalMaterials.filter((m) => m.categoryId === selectedCategoryId)
    : globalMaterials;

  const handleSubmit = async () => {
    if (!form.globalMaterialId) { setError("יש לבחור חומר"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({
        globalMaterialId: form.globalMaterialId,
        price: form.price ? Number(form.price) : undefined,
        supplier: form.supplier.trim() || undefined,
        notes: form.notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? "שגיאה בהוספה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <PlaylistAddIcon sx={{ color: "primary.main" }} />
        הוסף חומר לרשימה שלי
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="סנן לפי קטגוריה"
              fullWidth
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(Number(e.target.value));
                handleChange("globalMaterialId", 0);
              }}
            >
              <MenuItem value={0}>כל הקטגוריות</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="חומר *"
              fullWidth
              value={form.globalMaterialId || ""}
              onChange={(e) => handleChange("globalMaterialId", Number(e.target.value))}
            >
              {filteredMaterials.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="grey.500" fontSize="0.875rem">אין חומרים בקטגוריה זו</Typography>
                </MenuItem>
              ) : (
                filteredMaterials.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                    <Typography component="span" color="grey.500" fontSize="0.8rem" sx={{ mr: 1 }}>
                      {" "}({m.unit})
                    </Typography>
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

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
          {loading ? "מוסיף..." : "הוסף לרשימה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddContractorMaterialModal;
