import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import { useCategory } from "../hooks/useCategory";
import type { MaterialCategory, CreateCategoryDto } from "../types/materials.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateCategoryDto) => Promise<void>;
  editItem?: MaterialCategory | null;
}

export const CategoryModal = ({ open, onClose, onSave, editItem }: Props) => {
  const { values, setValue, errors, onBlur, isValid, loading, serverError, handleSubmit } =
    useCategory(editItem, open, onSave, onClose);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <CategoryIcon sx={{ color: "primary.main" }} />
        {editItem ? "עריכת קטגוריה" : "קטגוריה חדשה"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0.5 }}>
          <TextField
            label="שם קטגוריה *"
            fullWidth
            value={values.name}
            onChange={(e) => setValue("name", e.target.value)}
            onBlur={() => onBlur("name")}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="תיאור"
            fullWidth
            multiline
            rows={2}
            value={values.description}
            onChange={(e) => setValue("description", e.target.value)}
          />
        </Box>
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

