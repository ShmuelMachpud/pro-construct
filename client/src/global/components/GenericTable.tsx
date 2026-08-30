import { useLayoutEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Typography, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { ReactNode, MouseEvent } from "react";
import { useTableFilters, isColumnFilterable } from "../hooks/useTableFilters";
import { ColumnFilterMenu } from "./ColumnFilterMenu";

const MIN_TABLE_HEIGHT = 240;
const BOTTOM_SPACING = 24;

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  getFilterValue?: (row: T) => string;
  filterable?: boolean;
}

interface GenericTableProps<T extends object> {
  columns: ColumnDef<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

const getRowKey = <T extends object>(row: T, index: number): string => {
  const { id } = row as { id?: unknown };
  return id != null ? String(id) : String(index);
};

const GenericTable = <T extends object>({ columns, rows, loading, emptyMessage = "אין נתונים", onRowClick }: GenericTableProps<T>) => {
  const { filteredRows, getColumnOptions, isValueChecked, isColumnFiltered, toggleValue, selectAll, clearAll } =
    useTableFilters(columns, rows);
  const [openColIndex, setOpenColIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [tableMaxHeight, setTableMaxHeight] = useState<number>(MIN_TABLE_HEIGHT);

  useLayoutEffect(() => {
    const updateTableMaxHeight = () => {
      if (!tableContainerRef.current) return;
      const { top } = tableContainerRef.current.getBoundingClientRect();
      setTableMaxHeight(Math.max(window.innerHeight - top - BOTTOM_SPACING, MIN_TABLE_HEIGHT));
    };

    updateTableMaxHeight();
    window.addEventListener("resize", updateTableMaxHeight);
    return () => window.removeEventListener("resize", updateTableMaxHeight);
  }, [loading]);

  const handleFilterIconClick = (e: MouseEvent<HTMLButtonElement>, colIndex: number) => {
    e.stopPropagation();
    if (openColIndex === colIndex) {
      setOpenColIndex(null);
      return;
    }
    setAnchorEl(e.currentTarget);
    setOpenColIndex(colIndex);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  return (
    <TableContainer
      ref={tableContainerRef}
      component={Paper}
      sx={{
        maxHeight: tableMaxHeight,
        overflow: "auto",
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(255,107,0,0.2)",
        borderRadius: 2,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,107,0,0.35) transparent",
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,107,0,0.35)", borderRadius: 4 },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(255,107,0,0.55)" },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col, colIndex) => (
              <TableCell
                key={colIndex}
                sx={{
                  color: "#FF6B00",
                  fontWeight: "bold",
                  backgroundColor: "#1A1A1A",
                  borderBottom: "1px solid rgba(255,107,0,0.2)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {col.label}
                  {isColumnFilterable(col) && (
                    <IconButton
                      size="small"
                      aria-label={`סנן לפי ${col.label}`}
                      onClick={(e) => handleFilterIconClick(e, colIndex)}
                      sx={{ color: isColumnFiltered(colIndex) ? "#FF6B00" : "grey.600" }}
                    >
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
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
          ) : filteredRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: "center", color: "grey.500", py: 4, border: "none" }}
              >
                <Typography>לא נמצאו תוצאות התואמות לסינון</Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredRows.map((row, i) => (
              <TableRow
                key={getRowKey(row, i)}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? "pointer" : "default", "&:hover": { backgroundColor: "rgba(255,107,0,0.05)" } }}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
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
      {openColIndex !== null && (
        <ColumnFilterMenu
          anchorEl={anchorEl}
          open={openColIndex !== null}
          onClose={() => setOpenColIndex(null)}
          options={getColumnOptions(openColIndex)}
          isValueChecked={(value) => isValueChecked(openColIndex, value)}
          onToggle={(value) => toggleValue(openColIndex, value)}
          onSelectAll={() => selectAll(openColIndex)}
          onClearAll={() => clearAll(openColIndex)}
        />
      )}
    </TableContainer>
  );
};

export default GenericTable;
