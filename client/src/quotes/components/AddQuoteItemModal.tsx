import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography, ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useQuoteItemForm } from "../hooks/useQuoteItemForm";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { CreateQuoteItemDto, QuoteItemType } from "../types/quotes.types";
import { formatCurrency, quoteItemTypeLabel } from "../helpers/quotes.helpers";
import { isSourceRequired } from "../helpers/quoteItem.helpers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateQuoteItemDto) => Promise<void>;
  contractorMaterials: ContractorMaterial[];
}

export const AddQuoteItemModal = ({ open, onClose, onSave, contractorMaterials }: Props) => {
  const { values, setValue, errors, onBlur, isValid, validate, reset, handleTypeChange, handleMaterialSelect, selectedMaterial, lineTotal, buildDto } =
    useQuoteItemForm(contractorMaterials);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleClose = () => { reset(); setServerError(""); onClose(); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await onSave(buildDto());
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg ?? "שגיאה בהוספה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
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
              value={values.type}
              exclusive
              onChange={(_, val: QuoteItemType | null) => { if (val) handleTypeChange(val); }}
              fullWidth
              size="small"
            >
              {(["MATERIAL", "LABOR", "OTHER"] as QuoteItemType[]).map((t) => (
                <ToggleButton key={t} value={t}
                  sx={{ color: "grey.400", "&.Mui-selected": { color: "primary.main", borderColor: "primary.main" } }}
                >
                  {quoteItemTypeLabel[t]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          {isSourceRequired(values.type) && (
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="חומר *"
                fullWidth
                value={values.contractorMaterialId}
                onChange={(e) => handleMaterialSelect(e.target.value)}
                onBlur={() => onBlur("contractorMaterialId")}
                error={!!errors.contractorMaterialId}
                helperText={errors.contractorMaterialId}
              >
                {contractorMaterials.length === 0 ? (
                  <MenuItem disabled>
                    <Typography color="grey.500" fontSize="0.875rem">אין חומרים ברשימה שלך</Typography>
                  </MenuItem>
                ) : (
                  contractorMaterials.map((m) => (
                    <MenuItem key={m.id} value={String(m.id)}>
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
              value={values.description}
              onChange={(e) => setValue("description", e.target.value)}
              onBlur={() => onBlur("description")}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="כמות *"
              fullWidth
              type="number"
              inputProps={{ min: 0.001, step: 0.001 }}
              value={values.quantity}
              onChange={(e) => setValue("quantity", e.target.value)}
              onBlur={() => onBlur("quantity")}
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              label="מחיר ליחידה *"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={values.unitPrice}
              onChange={(e) => setValue("unitPrice", e.target.value)}
              onBlur={() => onBlur("unitPrice")}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
            />
          </Grid>

          {lineTotal !== null && lineTotal > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography color="grey.400" fontSize="0.875rem">
                סה"כ שורה:{" "}
                <strong style={{ color: "#FF6B00", fontSize: "1rem" }}>{formatCurrency(lineTotal)}</strong>
              </Typography>
            </Grid>
          )}
        </Grid>

        {serverError && <Box sx={{ mt: 1.5, color: "error.main", fontSize: "0.875rem" }}>{serverError}</Box>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isValid}>
          {loading ? "מוסיף..." : "הוסף"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

