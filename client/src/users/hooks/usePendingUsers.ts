import { useState, useEffect } from "react";
import { getPendingUsers } from "../services/users.service";
import type { PendingUser } from "../types/users.types";

export const usePendingUsers = () => {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPendingUsers()
      .then(setUsers)
      .catch(() => setError("שגיאה בטעינת המשתמשים"))
      .finally(() => setLoading(false));
  }, []);

  const removeUser = (userId: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== userId));

  return { users, loading, error, removeUser };
};
