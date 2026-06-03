import { useState } from "react";
import { Typography } from "@mui/material";
import GenericTable from "../../global/components/GenericTable";
import { useAllUsers } from "../hooks/useAllUsers";
import { useApproveUser } from "../hooks/useApproveUser";
import UserDetailsModal from "./UserDetailsModal";
import { allUsersColumns } from "../helpers/users.columns";
import type { UserInterface } from "../types/users.types";
const AllUsersTable = () => {
  const { users, loading, error, approveUserLocally, isAdmin } = useAllUsers();
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const { approve, loading: approving } = useApproveUser((userId) => {
    approveUserLocally(userId);
    setSelectedUser((prev) => (prev ? { ...prev, isApproved: true } : null));
  });

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <GenericTable<UserInterface>
        columns={allUsersColumns}
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
        canApprove={isAdmin}
      />
    </>
  );
};

export default AllUsersTable;
