import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useAddContractorMaterial } from "../hooks/useAddContractorMaterial";
import type { GlobalMaterial, MaterialCategory, AddContractorMaterialDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: AddContractorMaterialDto) => Promise<void>;
  globalMaterials: GlobalMaterial[];
  categories: MaterialCategory[];
}

export const AddContractorMaterialModal = ({ open, onClose, onSave, globalMaterials, categories }: Props) => {
  const { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit, handleClose } =
    useAddContractorMaterial(onSave, onClose);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  useEffect(() => {
    if (!open) setSelectedCategoryId(0);
  }, [open]);

  const filteredMaterials = selectedCategoryId
    ? globalMaterials.filter((m) => m.categoryId === selectedCategoryId)
    : globalMaterials;

  const handleCategoryFilter = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setValue("globalMaterialId", "");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
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
              onChange={(e) => handleCategoryFilter(Number(e.target.value))}
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
              value={values.globalMaterialId}
              onChange={(e) => setValue("globalMaterialId", e.target.value)}
              onBlur={() => onBlur("globalMaterialId")}
              error={!!errors.globalMaterialId}
              helperText={errors.globalMaterialId}
            >
              {filteredMaterials.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="grey.500" fontSize="0.875rem">אין חומרים בקטגוריה זו</Typography>
                </MenuItem>
              ) : (
                filteredMaterials.map((m) => (
                  <MenuItem key={m.id} value={String(m.id)}>
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
        <Button onClick={handleClose} color="inherit">ביטול</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !isValid}>
          {loading ? "מוסיף..." : "הוסף לרשימה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
