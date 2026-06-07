import { useState } from "react";
import {
  Box, Typography, Button, Chip, Divider, MenuItem, Select, FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import { useQuoteItems } from "../hooks/useQuoteItems";
import { useQuotes } from "../hooks/useQuotes";
import { useContractorMaterials } from "../../materials/hooks/useContractorMaterials";
import QuoteItemsTable from "../components/QuoteItemsTable";
import AddQuoteItemModal from "../components/AddQuoteItemModal";
import { calcGrandTotal, formatCurrency, quoteStatusConfig } from "../helpers/quotes.helpers";
import type { QuoteStatus } from "../types/quotes.types";

const QuoteDetailPage = () => {
  const { projectId, quoteId } = useParams<{ projectId: string; quoteId: string }>();
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState(false);
  const { quotes, handleUpdate: handleQuoteUpdate } = useQuotes(projectId!);
  const { items, loading, handleAdd, handleUpdate, handleDelete } = useQuoteItems(
    projectId!,
    Number(quoteId),
  );
  const { materials: contractorMaterials } = useContractorMaterials();

  const quote = quotes.find((q) => q.id === Number(quoteId));
  const grandTotal = calcGrandTotal(items);

  if (!quote && quotes.length > 0) {
    return <Typography color="error">הצעה לא נמצאה</Typography>;
  }

  const status = quote ? quoteStatusConfig[quote.status] : null;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/quotes/${projectId}`)}
            sx={{ color: "grey.400" }}
          >
            חזרה
          </Button>
          <Typography variant="h5" fontWeight="bold" color="white">
            {quote?.title ?? ""}
          </Typography>
          {status && quote && (
            <FormControl size="small">
              <Select
                value={quote.status}
                onChange={(e) => handleQuoteUpdate(quote.id, { status: e.target.value as QuoteStatus })}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: status.color,
                  border: `1px solid ${status.color}66`,
                  backgroundColor: `${status.color}22`,
                  ".MuiOutlinedInput-notchedOutline": { border: "none" },
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                }}
              >
                {(Object.keys(quoteStatusConfig) as QuoteStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{quoteStatusConfig[s].label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {quote?.validUntil && (
            <Chip
              label={`תוקף עד ${new Date(quote.validUntil).toLocaleDateString("he-IL")}`}
              size="small"
              sx={{ color: "grey.400", borderColor: "grey.700", border: "1px solid" }}
            />
          )}
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          הוסף פריט
        </Button>
      </Box>

      <QuoteItemsTable
        items={items}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      {items.length > 0 && (
        <>
          <Divider sx={{ borderColor: "rgba(255,107,0,0.2)", my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{
              backgroundColor: "#1E1E1E",
              border: "1px solid rgba(255,107,0,0.3)",
              borderRadius: 2,
              px: 4,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}>
              <Typography color="grey.400">סה"כ הצעת מחיר</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      <AddQuoteItemModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
        contractorMaterials={contractorMaterials}
      />
    </Box>
  );
};

export default QuoteDetailPage;
