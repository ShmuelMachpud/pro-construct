import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import GenericTable, { type ColumnDef } from "../../global/components/GenericTable";
import { usePendingUsers } from "../hooks/usePendingUsers";
import { useApproveUser } from "../hooks/useApproveUser";
import UserDetailsModal from "./UserDetailsModal";
import type { PendingUser } from "../types/users.types";

const columns: ColumnDef<PendingUser>[] = [
  { key: "name", label: "שם" },
  { key: "email", label: "אימייל" },
  {
    key: "createdAt",
    label: "תאריך הרשמה",
    render: (row) => new Date(row.createdAt).toLocaleDateString("he-IL"),
  },
  {
    key: "role",
    label: "סטטוס",
    render: () => (
      <Chip label="ממתין לאישור" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />
    ),
  },
];

const PendingUsersTable = () => {
  const { users, loading, error, removeUser } = usePendingUsers();
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const { approve, loading: approving } = useApproveUser((userId) => {
    removeUser(userId);
    setSelectedUser(null);
  });

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <GenericTable<PendingUser>
        columns={columns}
        rows={users}
        loading={loading}
        emptyMessage="אין משתמשים הממתינים לאישור"
        onRowClick={setSelectedUser}
      />
      <UserDetailsModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onApprove={approve}
        approving={approving}
      />
    </>
  );
};

export default PendingUsersTable;
