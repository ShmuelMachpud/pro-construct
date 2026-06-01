import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import GenericTable from "../../global/components/GenericTable";
import CategoryModal from "./CategoryModal";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { getCategoryColumns } from "../helpers/materials.columns";
import { useCategories } from "../hooks/useCategories";
import type { MaterialCategory } from "../types/materials.types";

const CategoriesTab = () => {
  const { categories, loading, error, handleCreate, handleUpdate, handleDelete } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MaterialCategory | null>(null);
  const [deleteItem, setDeleteItem] = useState<MaterialCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (row: MaterialCategory) => { setEditItem(row); setModalOpen(true); };
  const handleDeleteClick = (row: MaterialCategory) => setDeleteItem(row);

  const handleSave = async (dto: { name: string; description?: string }) => {
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
          קטגוריה חדשה
        </Button>
      </Box>

      {!loading && categories.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "grey.600" }}>
          <CategoryIcon sx={{ fontSize: 56, mb: 1.5 }} />
          <Typography>אין קטגוריות עדיין. הוסף קטגוריה ראשונה.</Typography>
        </Box>
      ) : (
        <GenericTable<MaterialCategory>
          columns={getCategoryColumns(handleEdit, handleDeleteClick)}
          rows={categories}
          loading={loading}
          emptyMessage="אין קטגוריות"
        />
      )}

      <CategoryModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
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

export default CategoriesTab;
