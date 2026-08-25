import { useState } from "react";
import GenericTable from "../../global/components/GenericTable";
import { getQuoteItemsColumns } from "../helpers/quoteItems.columns";
import type { QuoteItem, UpdateQuoteItemDto } from "../types/quotes.types";
import type { ContractorMaterial } from "../../materials/types/materials.types";

interface Props {
  items: QuoteItem[];
  loading: boolean;
  onUpdate: (id: number, dto: UpdateQuoteItemDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  contractorMaterials: ContractorMaterial[];
}

const QuoteItemsTable = ({ items, loading, onUpdate, onDelete, contractorMaterials }: Props) => {
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

  const columns = getQuoteItemsColumns(contractorMaterials, {
    editingId,
    editDescription,
    editQuantity,
    editUnitPrice,
    saving,
    setEditDescription,
    setEditQuantity,
    setEditUnitPrice,
    startEdit,
    cancelEdit,
    saveEdit,
    onDelete,
  });

  return (
    <GenericTable<QuoteItem>
      columns={columns}
      rows={items}
      loading={loading}
      emptyMessage="אין פריטים בהצעה זו עדיין"
    />
  );
};

export default QuoteItemsTable;
