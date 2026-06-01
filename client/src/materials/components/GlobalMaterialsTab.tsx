import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import GenericTable from "../../global/components/GenericTable";
import GlobalMaterialModal from "./GlobalMaterialModal";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { getGlobalMaterialColumns } from "../helpers/materials.columns";
import { useGlobalMaterials } from "../hooks/useGlobalMaterials";
import { useCategories } from "../hooks/useCategories";
import type { GlobalMaterial, CreateGlobalMaterialDto } from "../types/materials.types";

const GlobalMaterialsTab = () => {
  const { materials, loading, error, handleCreate, handleUpdate, handleDelete } = useGlobalMaterials();
  const { categories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<GlobalMaterial | null>(null);
  const [deleteItem, setDeleteItem] = useState<GlobalMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (row: GlobalMaterial) => { setEditItem(row); setModalOpen(true); };
  const handleDeleteClick = (row: GlobalMaterial) => setDeleteItem(row);

  const handleSave = async (dto: CreateGlobalMaterialDto) => {
    if (editItem) {
      await handleUpdate(editItem.id, dto);
    } else {
      await handleCreate(dto);
    }
    setEditItem(null);
  };

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
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditItem(null); setModalOpen(true); }}
        >
          חומר חדש
        </Button>
      </Box>

      {!loading && materials.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "grey.600" }}>
          <InventoryIcon sx={{ fontSize: 56, mb: 1.5 }} />
          <Typography>אין חומרים עדיין. הוסף חומר ראשון.</Typography>
        </Box>
      ) : (
        <GenericTable<GlobalMaterial>
          columns={getGlobalMaterialColumns(handleEdit, handleDeleteClick)}
          rows={materials}
          loading={loading}
          emptyMessage="אין חומרים"
        />
      )}

      <GlobalMaterialModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
        categories={categories}
        editItem={editItem}
      />

      <ConfirmDeleteDialog
        open={!!deleteItem}
        itemName={deleteItem?.name ?? ""}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteItem(null)}
      />
    </>
  );
};

export default GlobalMaterialsTab;
