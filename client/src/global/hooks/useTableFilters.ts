import { useMemo, useState } from "react";
import type { ColumnDef } from "../components/GenericTable";

export const isColumnFilterable = <T extends object>(col: ColumnDef<T>): boolean =>
  col.filterable !== false && (!col.render || !!col.getFilterValue);

const resolveFilterValue = <T extends object>(col: ColumnDef<T>, row: T): string =>
  col.getFilterValue ? col.getFilterValue(row) : String(row[col.key] ?? "");

export const useTableFilters = <T extends object>(columns: ColumnDef<T>[], rows: T[]) => {
  const [excludedValues, setExcludedValues] = useState<Record<number, Set<string>>>({});

  const getColumnOptions = (colIndex: number): string[] => {
    const col = columns[colIndex];
    const values = new Set(rows.map((row) => resolveFilterValue(col, row)));
    return Array.from(values).sort((a, b) => a.localeCompare(b, "he"));
  };

  const isValueChecked = (colIndex: number, value: string): boolean =>
    !excludedValues[colIndex]?.has(value);

  const isColumnFiltered = (colIndex: number): boolean => !!excludedValues[colIndex]?.size;

  const toggleValue = (colIndex: number, value: string) => {
    setExcludedValues((prev) => {
      const next = new Set(prev[colIndex] ?? []);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      const rest = { ...prev };
      if (next.size) rest[colIndex] = next;
      else delete rest[colIndex];
      return rest;
    });
  };

  const selectAll = (colIndex: number) => {
    setExcludedValues((prev) => {
      const rest = { ...prev };
      delete rest[colIndex];
      return rest;
    });
  };

  const clearAll = (colIndex: number) => {
    setExcludedValues((prev) => ({ ...prev, [colIndex]: new Set(getColumnOptions(colIndex)) }));
  };

  const filteredRows = useMemo(() => {
    const activeCols = Object.entries(excludedValues).filter(([, set]) => set.size > 0);
    if (!activeCols.length) return rows;
    return rows.filter((row) =>
      activeCols.every(([colIndexStr, excluded]) => {
        const col = columns[Number(colIndexStr)];
        return !excluded.has(resolveFilterValue(col, row));
      }),
    );
  }, [rows, columns, excludedValues]);

  return {
    filteredRows,
    getColumnOptions,
    isValueChecked,
    isColumnFiltered,
    toggleValue,
    selectAll,
    clearAll,
  };
};
