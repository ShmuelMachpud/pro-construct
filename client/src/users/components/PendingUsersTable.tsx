import { useState } from "react";
import { Typography } from "@mui/material";
import GenericTable from "../../global/components/GenericTable";
import { usePendingUsers } from "../hooks/usePendingUsers";
import { useApproveUser } from "../hooks/useApproveUser";
import UserDetailsModal from "./UserDetailsModal";
import { pendingUsersColumns } from "../helpers/users.columns";
import type { UserInterface } from "../types/users.types";

const PendingUsersTable = () => {
  const { users, loading, error, removeUser } = usePendingUsers();
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const { approve, loading: approving } = useApproveUser((userId) => {
    removeUser(userId);
    setSelectedUser(null);
  });

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <GenericTable<UserInterface>
        columns={pendingUsersColumns}
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
        canApprove={true}
      />
    </>
  );
};

export default PendingUsersTable;
