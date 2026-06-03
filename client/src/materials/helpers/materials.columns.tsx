import { IconButton, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ColumnDef } from "../../global/components/GenericTable";
import type {
  MaterialCategory,
  GlobalMaterial,
  ContractorMaterial,
} from "../types/materials.types";

const ActionsCell = <T extends object>({
  row,
  onEdit,
  onDelete,
}: {
  row: T;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}) => (
  <Box sx={{ display: "flex", gap: 0.5 }}>
    <IconButton
      size="small"
      onClick={(e) => { e.stopPropagation(); onEdit(row); }}
      sx={{ color: "grey.500", "&:hover": { color: "primary.main" } }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={(e) => { e.stopPropagation(); onDelete(row); }}
      sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
);

export const getCategoryColumns = (
  onEdit: (row: MaterialCategory) => void,
  onDelete: (row: MaterialCategory) => void,
  canEdit = true,
): ColumnDef<MaterialCategory>[] => {
  const base: ColumnDef<MaterialCategory>[] = [
    { key: "name", label: "שם קטגוריה" },
    { key: "description", label: "תיאור", render: (row) => row.description ?? "—" },
  ];
  if (!canEdit) return base;
  return [...base, {
    key: "id",
    label: "פעולות",
    render: (row) => <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />,
  }];
};

export const getGlobalMaterialColumns = (
  onEdit: (row: GlobalMaterial) => void,
  onDelete: (row: GlobalMaterial) => void,
  canEdit = true,
): ColumnDef<GlobalMaterial>[] => {
  const base: ColumnDef<GlobalMaterial>[] = [
    { key: "name", label: "שם חומר" },
    { key: "category", label: "קטגוריה", render: (row) => row.category.name },
    { key: "unit", label: "יחידת מידה" },
    { key: "description", label: "תיאור", render: (row) => row.description ?? "—" },
  ];
  if (!canEdit) return base;
  return [...base, {
    key: "id",
    label: "פעולות",
    render: (row) => <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />,
  }];
};

export const getContractorMaterialColumns = (
  onEdit: (row: ContractorMaterial) => void,
  onDelete: (row: ContractorMaterial) => void,
): ColumnDef<ContractorMaterial>[] => [
  { key: "globalMaterial", label: "שם חומר", render: (row) => row.globalMaterial.name },
  { key: "globalMaterial", label: "קטגוריה", render: (row) => row.globalMaterial.category.name },
  { key: "globalMaterial", label: "יחידת מידה", render: (row) => row.globalMaterial.unit },
  {
    key: "price",
    label: "מחיר",
    render: (row) =>
      row.price != null ? (
        <Typography color="white" fontSize="0.875rem">
          ₪{Number(row.price).toFixed(2)}
        </Typography>
      ) : (
        <Typography color="grey.600" fontSize="0.875rem">—</Typography>
      ),
  },
  {
    key: "supplier",
    label: "ספק",
    render: (row) =>
      row.supplier ?? <Typography color="grey.600" fontSize="0.875rem">—</Typography>,
  },
  {
    key: "notes",
    label: "הערות",
    render: (row) =>
      row.notes ?? <Typography color="grey.600" fontSize="0.875rem">—</Typography>,
  },
  {
    key: "id",
    label: "פעולות",
    render: (row) => <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />,
  },
];
