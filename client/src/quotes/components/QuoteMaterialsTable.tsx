import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Box, Typography, CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { ProjectMaterial } from "../types/quotes.types";
import { calcLineTotal, formatCurrency } from "../helpers/quotes.helpers";

interface Props {
  materials: ProjectMaterial[];
  loading: boolean;
  onUpdate: (id: number, quantity: number, notes: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const QuoteMaterialsTable = ({ materials, loading, onUpdate, onDelete }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (m: ProjectMaterial) => {
    setEditingId(m.id);
    setEditQuantity(String(m.quantity));
    setEditNotes(m.notes ?? "");
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (id: number) => {
    if (!editQuantity || Number(editQuantity) <= 0) return;
    setSaving(true);
    try {
      await onUpdate(id, Number(editQuantity), editNotes);
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
            {["חומר", "קטגוריה", "יחידה", "מחיר", "כמות", "סה\"כ שורה", "הערות", ""].map((h) => (
              <TableCell key={h} sx={{ color: "#FF6B00", fontWeight: "bold", borderBottom: "1px solid rgba(255,107,0,0.2)" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: "center", color: "grey.500", py: 4, border: "none" }}>
                <Typography>אין חומרים בהצעה זו עדיין</Typography>
              </TableCell>
            </TableRow>
          ) : (
            materials.map((m) => {
              const isEditing = editingId === m.id;
              const lineTotal = isEditing && Number(editQuantity) > 0
                ? Number(m.contractorMaterial.price ?? 0) * Number(editQuantity)
                : calcLineTotal(m);

              return (
                <TableRow key={m.id} sx={{ "&:hover": { backgroundColor: "rgba(255,107,0,0.03)" } }}>
                  <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {m.contractorMaterial.globalMaterial.name}
                  </TableCell>
                  <TableCell sx={{ color: "grey.400", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {m.contractorMaterial.globalMaterial.category.name}
                  </TableCell>
                  <TableCell sx={{ color: "grey.400", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {m.contractorMaterial.globalMaterial.unit}
                  </TableCell>
                  <TableCell sx={{ color: "grey.300", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {m.contractorMaterial.price != null
                      ? formatCurrency(Number(m.contractorMaterial.price))
                      : <Typography color="grey.600" fontSize="0.875rem">—</Typography>
                    }
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
                        autoFocus
                      />
                    ) : (
                      <Typography color="grey.300">{Number(m.quantity).toLocaleString()}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Typography color={lineTotal > 0 ? "#FF6B00" : "grey.600"} fontWeight={lineTotal > 0 ? "bold" : "normal"}>
                      {lineTotal > 0 ? formatCurrency(lineTotal) : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", minWidth: 140 }}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="הערות"
                        sx={{ width: 130 }}
                      />
                    ) : (
                      <Typography color="grey.500" fontSize="0.8rem">{m.notes ?? "—"}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {isEditing ? (
                        <>
                          <IconButton size="small" onClick={() => saveEdit(m.id)} disabled={saving} sx={{ color: "success.main" }}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={cancelEdit} sx={{ color: "grey.500" }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton size="small" onClick={() => startEdit(m)} sx={{ color: "grey.500", "&:hover": { color: "primary.main" } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => onDelete(m.id)} sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}>
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

export default QuoteMaterialsTable;
