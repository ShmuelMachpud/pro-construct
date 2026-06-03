import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { CreatePriceQuoteDto } from "../types/quotes.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreatePriceQuoteDto) => Promise<void>;
}

const emptyForm = { title: "", validUntil: "", notes: "" };

const CreateQuoteModal = ({ open, onClose, onSave }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setForm(emptyForm); setError(""); }
  }, [open]);

  const handleChange = (field: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("יש להזין כותרת להצעה"); return; }
    setLoading(true);
    setError("");
    try {
      await onSave({
        title: form.title.trim(),
        validUntil: form.validUntil || undefined,
        notes: form.notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "שגיאה ביצירה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
    >
      <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
        <ReceiptLongIcon sx={{ color: "primary.main" }} />
        צור הצעת מחיר חדשה
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="כותרת *"
              fullWidth
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="תאריך תפוגה"
              fullWidth
              type="date"
              value={form.validUntil}
              onChange={(e) => handleChange("validUntil", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
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
          {loading ? "יוצר..." : "צור הצעה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuoteModal;
