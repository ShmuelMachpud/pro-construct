import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
}

interface GenericTableProps<T extends object> {
  columns: ColumnDef<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

const GenericTable = <T extends object>({ columns, rows, loading, emptyMessage = "אין נתונים", onRowClick }: GenericTableProps<T>) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                sx={{ color: "#FF6B00", fontWeight: "bold", borderBottom: "1px solid rgba(255,107,0,0.2)" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center", color: "grey.500", py: 4, border: "none" }}
              >
                <Typography>{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? "pointer" : "default", "&:hover": { backgroundColor: "rgba(255,107,0,0.05)" } }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    sx={{ color: "grey.300", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
