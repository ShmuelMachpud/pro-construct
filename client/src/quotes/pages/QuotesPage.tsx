import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../global/components/GenericTable";
import { useAllQuotes } from "../hooks/useAllQuotes";
import { getQuotesColumns } from "../helpers/quotes.columns";
import { CreateQuoteModal } from "../components/CreateQuoteModal";
import type { CreatePriceQuoteDto, PriceQuoteWithProject } from "../types/quotes.types";

const QuotesPage = () => {
  const navigate = useNavigate();
  const { quotes, loading, error, handleCreate, handleDelete } = useAllQuotes();
  const [createOpen, setCreateOpen] = useState(false);

  const onSave = (projectId: string, dto: CreatePriceQuoteDto) => handleCreate(projectId, dto);
  const onDelete = (quote: PriceQuoteWithProject) => handleDelete(quote.projectId, quote.id);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="white">
          הצעות מחיר
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          צור הצעת מחיר
        </Button>
      </Box>

      {quotes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "grey.600" }}>
          <ReceiptLongIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography>אין הצעות מחיר עדיין.</Typography>
        </Box>
      ) : (
        <GenericTable<PriceQuoteWithProject>
          columns={getQuotesColumns(onDelete)}
          rows={quotes}
          onRowClick={(quote) => navigate(`/quotes/${quote.projectId}/${quote.id}`)}
        />
      )}

      <CreateQuoteModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={onSave}
      />
    </Box>
  );
};

export default QuotesPage;
