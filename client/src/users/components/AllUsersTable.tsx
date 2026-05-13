import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import GenericTable, { type ColumnDef } from "../../global/components/GenericTable";
import { useAllUsers } from "../hooks/useAllUsers";
import { useApproveUser } from "../hooks/useApproveUser";
import UserDetailsModal from "./UserDetailsModal";
import type { User } from "../types/users.types";

const roleLabel: Record<string, string> = {
  admin: "מנהל",
  operator: "מפעיל",
  contractor: "קבלן",
};

const columns: ColumnDef<User>[] = [
  { key: "name", label: "שם" },
  { key: "email", label: "אימייל" },
  {
    key: "role",
    label: "תפקיד",
    render: (row) => roleLabel[row.role] ?? row.role,
  },
  {
    key: "isApproved",
    label: "סטטוס",
    render: (row) =>
      row.isApproved ? (
        <Chip label="מאושר" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
      ) : (
        <Chip label="ממתין לאישור" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />
      ),
  },
  {
    key: "createdAt",
    label: "תאריך הרשמה",
    render: (row) => new Date(row.createdAt).toLocaleDateString("he-IL"),
  },
];

const AllUsersTable = () => {
  const { users, loading, error, approveUserLocally } = useAllUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { approve, loading: approving } = useApproveUser((userId) => {
    approveUserLocally(userId);
    setSelectedUser((prev) => prev ? { ...prev, isApproved: true } : null);
  });

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <GenericTable<User>
        columns={columns}
        rows={users}
        loading={loading}
        emptyMessage="אין משתמשים במערכת"
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

export default AllUsersTable;
