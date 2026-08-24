import { Chip, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ColumnDef } from "../../global/components/GenericTable";
import type { PriceQuoteWithProject } from "../types/quotes.types";
import { quoteStatusConfig } from "./quotes.helpers";

const formatQuoteDate = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString("he-IL") : "—";

export const getQuotesColumns = (
  onDelete: (quote: PriceQuoteWithProject) => void,
): ColumnDef<PriceQuoteWithProject>[] => [
  { key: "title", label: "כותרת" },
  { key: "projectName", label: "פרויקט" },
  {
    key: "status",
    label: "סטטוס",
    render: (row) => {
      const status = quoteStatusConfig[row.status];
      return (
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
      );
    },
    getFilterValue: (row) => quoteStatusConfig[row.status].label,
  },
  {
    key: "validUntil",
    label: "תוקף עד",
    render: (row) => formatQuoteDate(row.validUntil),
    getFilterValue: (row) => formatQuoteDate(row.validUntil),
  },
  {
    key: "createdAt",
    label: "תאריך יצירה",
    render: (row) => formatQuoteDate(row.createdAt),
    getFilterValue: (row) => formatQuoteDate(row.createdAt),
  },
  {
    key: "id",
    label: "פעולות",
    render: (row) => (
      <Tooltip title="מחק הצעה">
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
          sx={{ color: "grey.600", "&:hover": { color: "error.main" } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
  },
];
