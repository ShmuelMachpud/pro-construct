import { Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { ColumnDef } from "../../global/components/GenericTable";
import type { ContractorMaterial } from "../../materials/types/materials.types";
import type { QuoteItem } from "../types/quotes.types";
import { calcLineTotal, formatCurrency, getItemCategory, quoteItemTypeLabel } from "./quotes.helpers";

export interface QuoteItemEditState {
  editingId: number | null;
  editDescription: string;
  editQuantity: string;
  editUnitPrice: string;
  saving: boolean;
  setEditDescription: (value: string) => void;
  setEditQuantity: (value: string) => void;
  setEditUnitPrice: (value: string) => void;
  startEdit: (item: QuoteItem) => void;
  cancelEdit: () => void;
  saveEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const getQuoteItemsColumns = (
  contractorMaterials: ContractorMaterial[],
  edit: QuoteItemEditState,
): ColumnDef<QuoteItem>[] => [
  {
    key: "type",
    label: "סוג",
    render: (row) => (
      <Chip
        label={quoteItemTypeLabel[row.type]}
        size="small"
        sx={{ backgroundColor: "rgba(255,107,0,0.1)", color: "#FF6B00", fontSize: "0.75rem" }}
      />
    ),
    getFilterValue: (row) => quoteItemTypeLabel[row.type],
  },
  {
    key: "sourceId",
    label: "קטגוריה",
    render: (row) => getItemCategory(row, contractorMaterials),
    getFilterValue: (row) => getItemCategory(row, contractorMaterials),
  },
  {
    key: "description",
    label: "תיאור",
    render: (row) =>
      edit.editingId === row.id ? (
        <TextField
          size="small"
          value={edit.editDescription}
          onChange={(e) => edit.setEditDescription(e.target.value)}
          sx={{ width: 180 }}
          autoFocus
        />
      ) : row.description,
    getFilterValue: (row) => row.description,
  },
  {
    key: "quantity",
    label: "כמות",
    render: (row) =>
      edit.editingId === row.id ? (
        <TextField
          size="small"
          type="number"
          value={edit.editQuantity}
          onChange={(e) => edit.setEditQuantity(e.target.value)}
          inputProps={{ min: 0.001, step: 0.001 }}
          sx={{ width: 90 }}
        />
      ) : (
        <Typography color="grey.300">{Number(row.quantity).toLocaleString()}</Typography>
      ),
    getFilterValue: (row) => Number(row.quantity).toLocaleString(),
  },
  {
    key: "unitPrice",
    label: "מחיר ליחידה",
    render: (row) =>
      edit.editingId === row.id ? (
        <TextField
          size="small"
          type="number"
          value={edit.editUnitPrice}
          onChange={(e) => edit.setEditUnitPrice(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
          sx={{ width: 110 }}
        />
      ) : (
        <Typography color="grey.300">{formatCurrency(Number(row.unitPrice))}</Typography>
      ),
    getFilterValue: (row) => formatCurrency(Number(row.unitPrice)),
  },
  {
    key: "id",
    label: "סה\"כ שורה",
    render: (row) => {
      const isEditing = edit.editingId === row.id;
      const quantity = isEditing ? Number(edit.editQuantity) : Number(row.quantity);
      const unitPrice = isEditing ? Number(edit.editUnitPrice) : Number(row.unitPrice);
      const lineTotal = isEditing ? quantity * unitPrice : calcLineTotal(row);
      return (
        <Typography color={lineTotal > 0 ? "#FF6B00" : "grey.600"} fontWeight={lineTotal > 0 ? "bold" : "normal"}>
          {lineTotal > 0 ? formatCurrency(lineTotal) : "—"}
        </Typography>
      );
    },
    getFilterValue: (row) => {
      const lineTotal = calcLineTotal(row);
      return lineTotal > 0 ? formatCurrency(lineTotal) : "—";
    },
  },
  {
    key: "id",
    label: "",
    render: (row) => {
      const isEditing = edit.editingId === row.id;
      return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {isEditing ? (
            <>
              <IconButton size="small" onClick={() => edit.saveEdit(row.id)} disabled={edit.saving} sx={{ color: "success.main" }}>
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={edit.cancelEdit} sx={{ color: "grey.500" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size="small" onClick={() => edit.startEdit(row)} sx={{ color: "grey.500", "&:hover": { color: "primary.main" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => edit.onDelete(row.id)} sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      );
    },
  },
];
