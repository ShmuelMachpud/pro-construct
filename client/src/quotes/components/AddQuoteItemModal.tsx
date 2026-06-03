import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { CreateQuoteItemDto, QuoteItemType } from "../types/quotes.types";
import { formatCurrency, quoteItemTypeLabel } from "../helpers/quotes.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateQuoteItemDto) => Promise<void>;
  contractorMaterials: ContractorMaterial[];
}

const emptyForm = {
  type: "MATERIAL" as QuoteItemType,
  contractorMaterialId: 0,
  description: "",
  quantity: "",
  unitPrice: "",
};

const AddQuoteItemModal = ({ open, onClose, onSave, contractorMaterials }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setForm(emptyForm); setError(""); }
  }, [open]);

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, value: QuoteItemType | null) => {
    if (value) setForm({ ...emptyForm, type: value });
  };

  const handleChange = (field: keyof typeof emptyForm, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedMaterial = contractorMaterials.find((m) => m.id === form.contractorMaterialId);

  const handleMaterialSelect = (materialId: number) => {
    const mat = contractorMaterials.find((m) => m.id === materialId);
    setForm((prev) => ({
      ...prev,
      contractorMaterialId: materialId,
      description: mat ? mat.globalMaterial.name : "",
      unitPrice: mat?.price != null ? String(mat.price) : "",
    }));
  };

  const handleSubmit = async () => {
    if (form.type === "MATERIAL" && !form.contractorMaterialId) {
      setError("יש לבחור חומר"); return;
    }
    if (!form.description.trim()) { setError("יש להזין תיאור"); return; }
    if (!form.quantity || Number(form.quantity) <= 0) { setError("יש להזין כמות תקינה"); return; }
    if (!form.unitPrice || Number(form.unitPrice) < 0) { setError("יש להזין מחיר ליחידה"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({
        type: form.type,
        sourceId: form.type === "MATERIAL" ? form.contractorMaterialId : undefined,
        description: form.description.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "שגיאה בהוספה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const lineTotal =
    form.quantity && form.unitPrice
      ? Number(form.quantity) * Number(form.unitPrice)
      : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <PlaylistAddIcon sx={{ color: "primary.main" }} />
        הוסף פריט להצעה
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <ToggleButtonGroup
              value={form.type}
              exclusive
              onChange={handleTypeChange}
              fullWidth
              size="small"
            >
              {(["MATERIAL", "LABOR", "OTHER"] as QuoteItemType[]).map((t) => (
                <ToggleButton key={t} value={t} sx={{ color: "grey.400", "&.Mui-selected": { color: "primary.main", borderColor: "primary.main" } }}>
                  {quoteItemTypeLabel[t]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {form.type === "MATERIAL" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="חומר *"
                fullWidth
                value={form.contractorMaterialId || ""}
                onChange={(e) => handleMaterialSelect(Number(e.target.value))}
              >
                {contractorMaterials.length === 0 ? (
                  <MenuItem disabled>
                    <Typography color="grey.500" fontSize="0.875rem">אין חומרים ברשימה שלך</Typography>
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
          )}

          {selectedMaterial && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 1.5, backgroundColor: "rgba(255,107,0,0.06)", borderRadius: 2 }}>
                <Typography color="grey.400" fontSize="0.8rem">
                  יחידת מידה: <strong style={{ color: "white" }}>{selectedMaterial.globalMaterial.unit}</strong>
                  {selectedMaterial.supplier && (
                    <> · ספק: <strong style={{ color: "white" }}>{selectedMaterial.supplier}</strong></>
                  )}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              label="תיאור *"
              fullWidth
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="כמות *"
              fullWidth
              type="number"
              inputProps={{ min: 0.001, step: 0.001 }}
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="מחיר ליחידה *"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={form.unitPrice}
              onChange={(e) => handleChange("unitPrice", e.target.value)}
            />
          </Grid>

          {lineTotal !== null && lineTotal > 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography color="grey.400" fontSize="0.875rem">
                  סה"כ שורה:{" "}
                  <strong style={{ color: "#FF6B00", fontSize: "1rem" }}>
                    {formatCurrency(lineTotal)}
                  </strong>
                </Typography>
              </Box>
            </Grid>
          )}
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

export default AddQuoteItemModal;
