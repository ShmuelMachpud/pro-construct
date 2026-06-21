import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Grid, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEditContractorMaterial } from "../hooks/useEditContractorMaterial";
import type { ContractorMaterial, UpdateContractorMaterialDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (id: number, dto: UpdateContractorMaterialDto) => Promise<void>;
  editItem: ContractorMaterial | null;
}

export const EditContractorMaterialModal = ({ open, onClose, onSave, editItem }: Props) => {
  const { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit } =
    useEditContractorMaterial(editItem, open, onSave, onClose);

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
              value={values.price}
              onChange={(e) => setValue("price", e.target.value)}
              onBlur={() => onBlur("price")}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="ספק"
              fullWidth
              value={values.supplier}
              onChange={(e) => setValue("supplier", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="הערות"
              fullWidth
              multiline
              rows={2}
              value={values.notes}
              onChange={(e) => setValue("notes", e.target.value)}
            />
          </Grid>
        </Grid>

        {serverError && <Box sx={{ mt: 1.5, color: "error.main", fontSize: "0.875rem" }}>{serverError}</Box>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isValid}>
          {loading ? "שומר..." : "שמור"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

