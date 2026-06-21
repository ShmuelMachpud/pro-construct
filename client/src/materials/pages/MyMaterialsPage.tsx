import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import InventoryIcon from "@mui/icons-material/Inventory";
import GenericTable from "../../global/components/GenericTable";
import { AddContractorMaterialModal } from "../components/AddContractorMaterialModal";
import { EditContractorMaterialModal } from "../components/EditContractorMaterialModal";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { getContractorMaterialColumns } from "../helpers/materials.columns";
import { useContractorMaterials } from "../hooks/useContractorMaterials";
import { useGlobalMaterials } from "../hooks/useGlobalMaterials";
import { useCategories } from "../hooks/useCategories";
import type { ContractorMaterial } from "../types/materials.types";

const MyMaterialsPage = () => {
  const { materials, loading, error, handleAdd, handleUpdate, handleDelete } =
    useContractorMaterials();
  const { materials: globalMaterials } = useGlobalMaterials();
  const { categories } = useCategories();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContractorMaterial | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContractorMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await handleDelete(deleteItem.id);
      setDeleteItem(null);
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">
          החומרים שלי
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlaylistAddIcon />}
          onClick={() => setAddOpen(true)}
        >
          הוסף חומר
        </Button>
      </Box>

      {!loading && materials.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <InventoryIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography>אין חומרים ברשימה שלך עדיין.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            הוסף חומרים מהרשימה הגלובלית וקבע מחירים וספקים.
          </Typography>
        </Box>
      ) : (
        <GenericTable<ContractorMaterial>
          columns={getContractorMaterialColumns(
            (row) => setEditItem(row),
            (row) => setDeleteItem(row),
          )}
          rows={materials}
          loading={loading}
          emptyMessage="אין חומרים"
        />
      )}

      <AddContractorMaterialModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        globalMaterials={globalMaterials}
        categories={categories}
      />

      <EditContractorMaterialModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={handleUpdate}
        editItem={editItem}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        itemName={deleteItem?.globalMaterial.name ?? ""}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteItem(null)}
      />
    </Box>
  );
};

export default MyMaterialsPage;
