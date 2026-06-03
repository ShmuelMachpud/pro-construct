import { Chip, Typography } from "@mui/material";
import type { ColumnDef } from "../../global/components/GenericTable";
import type { UserInterface } from "../../users/types/users.types";
import type { Project } from "../../projects/types/projects.types";
import { subscriptionLabel, subscriptionColor, formatDate } from "../../users/helpers/users.helpers";

const ApprovalChip = ({ isApproved }: { isApproved: boolean }) =>
  isApproved ? (
    <Chip label="מאושר" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
  ) : (
    <Chip label="ממתין" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />
  );

const statusLabel: Record<string, string> = {
  planning: "תכנון",
  in_progress: "בביצוע",
  completed: "הושלם",
};

const statusColor: Record<string, string> = {
  planning: "#FF6B00",
  in_progress: "#2196F3",
  completed: "#4CAF50",
};

export const contractorsColumns: ColumnDef<UserInterface>[] = [
  { key: "name", label: "שם" },
  { key: "email", label: "אימייל" },
  { key: "companyName", label: "חברה", render: (row) => row.companyName ?? "—" },
  { key: "isApproved", label: "סטטוס", render: (row) => <ApprovalChip isApproved={row.isApproved} /> },
  {
    key: "subscriptionStatus",
    label: "מנוי",
    render: (row) =>
      row.subscriptionStatus ? (
        <Chip
          label={subscriptionLabel[row.subscriptionStatus]}
          size="small"
          sx={{
            backgroundColor: `${subscriptionColor[row.subscriptionStatus]}22`,
            color: subscriptionColor[row.subscriptionStatus],
          }}
        />
      ) : (
        <Typography variant="caption" color="grey.600">—</Typography>
      ),
  },
  { key: "createdAt", label: "הרשמה", render: (row) => formatDate(row.createdAt) },
];

export const projectsColumns: ColumnDef<Project>[] = [
  { key: "name", label: "שם פרויקט" },
  { key: "location", label: "מיקום" },
  {
    key: "status",
    label: "סטטוס",
    render: (row) => (
      <Chip
        label={statusLabel[row.status] ?? row.status}
        size="small"
        sx={{
          backgroundColor: `${statusColor[row.status]}22`,
          color: statusColor[row.status],
        }}
      />
    ),
  },
  { key: "startDate", label: "התחלה", render: (row) => row.startDate ? formatDate(row.startDate) : "—" },
  { key: "createdAt", label: "נוצר", render: (row) => formatDate(row.createdAt) },
];
