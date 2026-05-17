import { Chip, Typography } from "@mui/material";
import type { ColumnDef } from "../../global/components/GenericTable";
import type { User, PendingUser } from "../types/users.types";
import { roleLabel, subscriptionLabel, subscriptionColor, formatDate } from "./users.helpers";

const ApprovalChip = ({ isApproved }: { isApproved: boolean }) =>
  isApproved ? (
    <Chip label="מאושר" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
  ) : (
    <Chip label="ממתין" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />
  );

export const allUsersColumns: ColumnDef<User>[] = [
  { key: "name", label: "שם" },
  { key: "email", label: "אימייל" },
  { key: "role", label: "תפקיד", render: (row) => roleLabel[row.role] ?? row.role },
  { key: "isApproved", label: "אישור", render: (row) => <ApprovalChip isApproved={row.isApproved} /> },
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

export const pendingUsersColumns: ColumnDef<PendingUser>[] = [
  { key: "name", label: "שם" },
  { key: "email", label: "אימייל" },
  { key: "companyName", label: "חברה", render: (row) => row.companyName ?? "—" },
  {
    key: "paymentToken",
    label: "כרטיס",
    render: (row) =>
      row.paymentToken ? (
        <Chip label="קיים" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
      ) : (
        <Typography variant="caption" color="grey.600">אין</Typography>
      ),
  },
  { key: "createdAt", label: "הרשמה", render: (row) => formatDate(row.createdAt) },
];
