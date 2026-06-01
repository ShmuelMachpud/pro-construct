import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { AddProjectMaterialDto } from "../types/quotes.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: AddProjectMaterialDto) => Promise<void>;
  contractorMaterials: ContractorMaterial[];
}

const emptyForm = { contractorMaterialId: 0, quantity: "", notes: "" };

const AddProjectMaterialModal = ({ open, onClose, onSave, contractorMaterials }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setForm(emptyForm); setError(""); }
  }, [open]);

  const handleChange = (field: keyof typeof emptyForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selected = contractorMaterials.find((m) => m.id === form.contractorMaterialId);

  const handleSubmit = async () => {
    if (!form.contractorMaterialId) { setError("יש לבחור חומר"); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setError("יש להזין כמות תקינה"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({
        contractorMaterialId: form.contractorMaterialId,
        quantity: Number(form.quantity),
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
        הוסף חומר להצעה
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="חומר *"
              fullWidth
              value={form.contractorMaterialId || ""}
              onChange={(e) => handleChange("contractorMaterialId", Number(e.target.value))}
            >
              {contractorMaterials.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="grey.500" fontSize="0.875rem">
                    אין חומרים ברשימה שלך
                  </Typography>
                </MenuItem>
              ) : (
                contractorMaterials.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    <Box>
                      <Typography fontSize="0.9rem">{m.globalMaterial.name}</Typography>
                      <Typography fontSize="0.75rem" color="grey.500">
                        {m.globalMaterial.category.name} ·{" "}
                        {m.price != null ? `₪${Number(m.price).toFixed(2)}` : "ללא מחיר"}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {selected && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 1.5, backgroundColor: "rgba(255,107,0,0.06)", borderRadius: 2 }}>
                <Typography color="grey.400" fontSize="0.8rem">
                  יחידת מידה: <strong style={{ color: "white" }}>{selected.globalMaterial.unit}</strong>
                  {selected.price != null && (
                    <> · מחיר ליחידה: <strong style={{ color: "#FF6B00" }}>₪{Number(selected.price).toFixed(2)}</strong></>
                  )}
                  {selected.supplier && (
                    <> · ספק: <strong style={{ color: "white" }}>{selected.supplier}</strong></>
                  )}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="כמות *"
              fullWidth
              type="number"
              inputProps={{ min: 0.001, step: 0.001 }}
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </Grid>

          {selected?.price != null && form.quantity && Number(form.quantity) > 0 && (
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%", pr: 1 }}>
                <Typography color="grey.400" fontSize="0.875rem">
                  סה"כ שורה:{" "}
                  <strong style={{ color: "#FF6B00", fontSize: "1rem" }}>
                    ₪{(Number(selected.price) * Number(form.quantity)).toFixed(2)}
                  </strong>
                </Typography>
              </Box>
            </Grid>
          )}

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
          {loading ? "מוסיף..." : "הוסף"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectMaterialModal;
