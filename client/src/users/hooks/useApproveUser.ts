import { useState } from "react";
import { approveUser } from "../services/users.service";

export const useApproveUser = (onSuccess: (userId: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const approve = async (userId: string) => {
    setLoading(true);
    setError("");
    try {
      await approveUser(userId);
      onSuccess(userId);
    } catch {
      setError("שגיאה באישור המשתמש");
    } finally {
      setLoading(false);
    }
  };

  return { approve, loading, error };
};
