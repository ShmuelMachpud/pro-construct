import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useGlobalMaterial } from "../hooks/useGlobalMaterial";
import type { GlobalMaterial, MaterialCategory, CreateGlobalMaterialDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateGlobalMaterialDto) => Promise<void>;
  categories: MaterialCategory[];
  editItem?: GlobalMaterial | null;
}

export const GlobalMaterialModal = ({ open, onClose, onSave, categories, editItem }: Props) => {
  const { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit } =
    useGlobalMaterial(editItem, open, onSave, onClose);

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
              value={values.name}
              onChange={(e) => setValue("name", e.target.value)}
              onBlur={() => onBlur("name")}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="קטגוריה *"
              fullWidth
              value={values.categoryId}
              onChange={(e) => setValue("categoryId", e.target.value)}
              onBlur={() => onBlur("categoryId")}
              error={!!errors.categoryId}
              helperText={errors.categoryId}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="יחידת מידה *"
              fullWidth
              placeholder='מ"ר, מ"ל, יח׳...'
              value={values.unit}
              onChange={(e) => setValue("unit", e.target.value)}
              onBlur={() => onBlur("unit")}
              error={!!errors.unit}
              helperText={errors.unit}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="תיאור"
              fullWidth
              multiline
              rows={2}
              value={values.description}
              onChange={(e) => setValue("description", e.target.value)}
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

