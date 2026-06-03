import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Box, Typography, CircularProgress, Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { QuoteItem, UpdateQuoteItemDto } from "../types/quotes.types";
import { calcLineTotal, formatCurrency, quoteItemTypeLabel } from "../helpers/quotes.helpers";

interface Props {
  items: QuoteItem[];
  loading: boolean;
  onUpdate: (id: number, dto: UpdateQuoteItemDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const QuoteItemsTable = ({ items, loading, onUpdate, onDelete }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnitPrice, setEditUnitPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (item: QuoteItem) => {
    setEditingId(item.id);
    setEditDescription(item.description);
    setEditQuantity(String(item.quantity));
    setEditUnitPrice(String(item.unitPrice));
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (id: number) => {
    if (!editQuantity || Number(editQuantity) <= 0) return;
    if (!editUnitPrice || Number(editUnitPrice) < 0) return;
    setSaving(true);
    try {
      await onUpdate(id, {
        description: editDescription,
        quantity: Number(editQuantity),
        unitPrice: Number(editUnitPrice),
      });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {["סוג", "תיאור", "כמות", "מחיר ליחידה", "סה\"כ שורה", ""].map((h) => (
              <TableCell key={h} sx={{ color: "#FF6B00", fontWeight: "bold", borderBottom: "1px solid rgba(255,107,0,0.2)" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", color: "grey.500", py: 4, border: "none" }}>
                <Typography>אין פריטים בהצעה זו עדיין</Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isEditing = editingId === item.id;
              const editQty = isEditing ? Number(editQuantity) : Number(item.quantity);
              const editPrice = isEditing ? Number(editUnitPrice) : Number(item.unitPrice);
              const lineTotal = isEditing ? editQty * editPrice : calcLineTotal(item);

              return (
                <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "rgba(255,107,0,0.03)" } }}>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Chip
                      label={quoteItemTypeLabel[item.type]}
                      size="small"
                      sx={{ backgroundColor: "rgba(255,107,0,0.1)", color: "#FF6B00", fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.05)", minWidth: 180 }}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        sx={{ width: 180 }}
                        autoFocus
                      />
                    ) : item.description}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", minWidth: 100 }}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        inputProps={{ min: 0.001, step: 0.001 }}
                        sx={{ width: 90 }}
                      />
                    ) : (
                      <Typography color="grey.300">{Number(item.quantity).toLocaleString()}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", minWidth: 120 }}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editUnitPrice}
                        onChange={(e) => setEditUnitPrice(e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ width: 110 }}
                      />
                    ) : (
                      <Typography color="grey.300">{formatCurrency(Number(item.unitPrice))}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Typography color={lineTotal > 0 ? "#FF6B00" : "grey.600"} fontWeight={lineTotal > 0 ? "bold" : "normal"}>
                      {lineTotal > 0 ? formatCurrency(lineTotal) : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {isEditing ? (
                        <>
                          <IconButton size="small" onClick={() => saveEdit(item.id)} disabled={saving} sx={{ color: "success.main" }}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={cancelEdit} sx={{ color: "grey.500" }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton size="small" onClick={() => startEdit(item)} sx={{ color: "grey.500", "&:hover": { color: "primary.main" } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => onDelete(item.id)} sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuoteItemsTable;
