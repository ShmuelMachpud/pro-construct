import type { ProjectMaterial } from "../types/quotes.types";

export const calcLineTotal = (m: ProjectMaterial): number =>
  Number(m.contractorMaterial.price ?? 0) * Number(m.quantity);

export const calcGrandTotal = (materials: ProjectMaterial[]): number =>
  materials.reduce((sum, m) => sum + calcLineTotal(m), 0);

export const formatCurrency = (amount: number): string =>
  `₪${amount.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
