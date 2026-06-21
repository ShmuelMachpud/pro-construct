import { Box, TextField, Grid, MenuItem, Typography, Chip, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { UseQuoteItemFormReturn } from "../hooks/useQuoteItemForm";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { QuoteItemType } from "../types/quotes.types";
import { formatCurrency, quoteItemTypeLabel } from "../helpers/quotes.helpers";

interface AddedItem { tempId: number; description: string; quantity: number; unitPrice: number }

interface Props {
  itemForm: UseQuoteItemFormReturn;
  contractorMaterials: ContractorMaterial[];
  addedItems: AddedItem[];
  itemError: string;
}

export const QuoteItemsStep = ({ itemForm, contractorMaterials, addedItems, itemError }: Props) => {
  const { values, setValue, errors, onBlur, handleTypeChange, handleMaterialSelect, selectedMaterial, lineTotal } = itemForm;

  return (
    <Box>
      {addedItems.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography color="grey.500" fontSize="0.8rem" mb={1}>פריטים שנוספו ({addedItems.length})</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {addedItems.map((item) => (
              <Chip
                key={item.tempId}
                label={`${item.description} · ${formatCurrency(item.quantity * item.unitPrice)}`}
                size="small"
                sx={{ backgroundColor: "rgba(255,107,0,0.1)", color: "grey.300", border: "1px solid rgba(255,107,0,0.3)" }}
              />
            ))}
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mt: 2, mb: 1 }} />
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <ToggleButtonGroup value={values.type} exclusive fullWidth size="small"
            onChange={(_, val: QuoteItemType | null) => { if (val) handleTypeChange(val); }}
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

        {values.type === "MATERIAL" && (
          <Grid size={{ xs: 12 }}>
            <TextField select label="חומר *" fullWidth value={values.contractorMaterialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
              onBlur={() => onBlur("contractorMaterialId")}
              error={!!errors.contractorMaterialId} helperText={errors.contractorMaterialId}
            >
              {contractorMaterials.length === 0 ? (
                <MenuItem disabled><Typography color="grey.500" fontSize="0.875rem">אין חומרים ברשימה</Typography></MenuItem>
              ) : contractorMaterials.map((m) => (
                <MenuItem key={m.id} value={String(m.id)}>
                  <Box>
                    <Typography fontSize="0.9rem">{m.globalMaterial.name}</Typography>
                    <Typography fontSize="0.75rem" color="grey.500">
                      {m.globalMaterial.category.name} · {m.price != null ? `₪${Number(m.price).toFixed(2)}` : "ללא מחיר"}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {selectedMaterial && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ p: 1.5, backgroundColor: "rgba(255,107,0,0.06)", borderRadius: 2 }}>
              <Typography color="grey.400" fontSize="0.8rem">
                יחידת מידה: <strong style={{ color: "white" }}>{selectedMaterial.globalMaterial.unit}</strong>
                {selectedMaterial.supplier && <> · ספק: <strong style={{ color: "white" }}>{selectedMaterial.supplier}</strong></>}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <TextField label="תיאור *" fullWidth value={values.description}
            onChange={(e) => setValue("description", e.target.value)}
            onBlur={() => onBlur("description")}
            error={!!errors.description} helperText={errors.description}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField label="כמות *" fullWidth type="number" inputProps={{ min: 0.001, step: 0.001 }}
            value={values.quantity} onChange={(e) => setValue("quantity", e.target.value)}
            onBlur={() => onBlur("quantity")} error={!!errors.quantity} helperText={errors.quantity}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField label="מחיר ליחידה *" fullWidth type="number" inputProps={{ min: 0, step: 0.01 }}
            value={values.unitPrice} onChange={(e) => setValue("unitPrice", e.target.value)}
            onBlur={() => onBlur("unitPrice")} error={!!errors.unitPrice} helperText={errors.unitPrice}
          />
        </Grid>

        {lineTotal !== null && lineTotal > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography color="grey.400" fontSize="0.875rem">
              סה"כ שורה: <strong style={{ color: "#FF6B00", fontSize: "1rem" }}>{formatCurrency(lineTotal)}</strong>
            </Typography>
          </Grid>
        )}

        {itemError && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>{itemError}</Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
