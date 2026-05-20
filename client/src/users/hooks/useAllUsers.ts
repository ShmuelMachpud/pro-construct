import { useState, useEffect } from "react";
import { getAllUsers } from "../services/users.service";
import type { UserInterface } from "../types/users.types";

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setError("שגיאה בטעינת המשתמשים"))
      .finally(() => setLoading(false));
  }, []);

  const approveUserLocally = (userId: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u)),
    );

  return { users, loading, error, approveUserLocally };
};
