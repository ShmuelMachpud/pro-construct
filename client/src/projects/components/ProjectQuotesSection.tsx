import { useState } from "react";
import {
  Box, Typography, Button, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { useQuotes } from "../../quotes/hooks/useQuotes";
import { CreateQuoteModal } from "../../quotes/components/CreateQuoteModal";
import { quoteStatusConfig } from "../../quotes/helpers/quotes.helpers";
import type { CreatePriceQuoteDto } from "../../quotes/types/quotes.types";

interface Props {
  projectId: string;
}

const ProjectQuotesSection = ({ projectId }: Props) => {
  const navigate = useNavigate();
  const { quotes, loading, handleCreate, handleDelete } = useQuotes(projectId);
  const [createOpen, setCreateOpen] = useState(false);

  const onSave = (_projectId: string, dto: CreatePriceQuoteDto) => handleCreate(dto);

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ borderColor: "rgba(255,107,0,0.15)", mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptLongIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography variant="h6" fontWeight="bold" color="white">הצעות מחיר</Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          צור הצעה
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} sx={{ color: "primary.main" }} />
        </Box>
      ) : quotes.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "grey.600" }}>
          <Typography fontSize="0.9rem">אין הצעות מחיר לפרויקט זה עדיין.</Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#1E1E1E", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 3 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { borderColor: "rgba(255,255,255,0.06)", color: "grey.500", fontWeight: "bold" } }}>
                <TableCell>כותרת</TableCell>
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
                    onClick={() => navigate(`/quotes/${projectId}/${quote.id}`)}
                    sx={{
                      cursor: "pointer",
                      "& td": { borderColor: "rgba(255,255,255,0.06)", color: "white" },
                      "&:hover": { backgroundColor: "rgba(255,107,0,0.05)" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>{quote.title}</TableCell>
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
                      {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString("he-IL") : "—"}
                    </TableCell>
                    <TableCell sx={{ color: "grey.400 !important" }}>
                      {new Date(quote.createdAt).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="מחק הצעה">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDelete(quote.id); }}
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
        fixedProjectId={projectId}
      />
    </Box>
  );
};

export default ProjectQuotesSection;
