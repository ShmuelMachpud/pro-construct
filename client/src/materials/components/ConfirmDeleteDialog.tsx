import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface Props {
  open: boolean;
  itemName: string;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteDialog = ({ open, itemName, loading, onConfirm, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{ sx: { backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 3 } }}
  >
    <DialogTitle sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>
      <WarningAmberIcon sx={{ color: "warning.main" }} />
      אישור מחיקה
    </DialogTitle>
    <DialogContent>
      <Typography color="grey.300">
        האם למחוק את <strong style={{ color: "white" }}>{itemName}</strong>?
      </Typography>
      <Typography variant="caption" color="grey.600" sx={{ mt: 0.5, display: "block" }}>
        פעולה זו אינה ניתנת לביטול.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose} color="inherit">ביטול</Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
        {loading ? "מוחק..." : "מחק"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
