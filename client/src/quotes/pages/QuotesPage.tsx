import { useState } from "react";
import {
  Box, Typography, Button, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { useAllQuotes } from "../hooks/useAllQuotes";
import { quoteStatusConfig } from "../helpers/quotes.helpers";
import { CreateQuoteModal } from "../components/CreateQuoteModal";
import type { CreatePriceQuoteDto } from "../types/quotes.types";

const QuotesPage = () => {
  const navigate = useNavigate();
  const { quotes, loading, error, handleCreate, handleDelete } = useAllQuotes();
  const [createOpen, setCreateOpen] = useState(false);

  const onSave = (projectId: string, dto: CreatePriceQuoteDto) => handleCreate(projectId, dto);

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
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { borderColor: "rgba(255,255,255,0.06)", color: "grey.500", fontWeight: "bold" } }}>
                <TableCell>כותרת</TableCell>
                <TableCell>פרויקט</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>תוקף עד</TableCell>
                <TableCell>תאריך יצירה</TableCell>
                <TableCell align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => {
                const status = quoteStatusConfig[quote.status];
                return (
                  <TableRow
                    key={quote.id}
                    onClick={() => navigate(`/quotes/${quote.projectId}/${quote.id}`)}
                    sx={{
                      cursor: "pointer",
                      "& td": { borderColor: "rgba(255,255,255,0.06)", color: "white" },
                      "&:hover": { backgroundColor: "rgba(255,107,0,0.05)" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>{quote.title}</TableCell>
                    <TableCell sx={{ color: "grey.400 !important" }}>{quote.projectName}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          backgroundColor: `${status.color}22`,
                          color: status.color,
                          border: `1px solid ${status.color}66`,
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "grey.400 !important" }}>
                      {quote.validUntil
                        ? new Date(quote.validUntil).toLocaleDateString("he-IL")
                        : "—"}
                    </TableCell>
                    <TableCell sx={{ color: "grey.400 !important" }}>
                      {new Date(quote.createdAt).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="מחק הצעה">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(quote.projectId, quote.id);
                          }}
                          sx={{ color: "grey.600", "&:hover": { color: "error.main" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
