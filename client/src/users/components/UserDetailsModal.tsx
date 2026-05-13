import { Box, Typography, Chip, Button } from "@mui/material";
import GenericModal from "../../global/components/GenericModal";
import type { User } from "../types/users.types";

const roleLabel: Record<string, string> = {
  admin: "מנהל",
  operator: "מפעיל",
  contractor: "קבלן",
};

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onApprove: (userId: string) => void;
  approving: boolean;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <Typography color="grey.500" fontSize="0.9rem">{label}</Typography>
    <Box>{children}</Box>
  </Box>
);

const UserDetailsModal = ({ user, open, onClose, onApprove, approving }: UserDetailsModalProps) => {
  if (!user) return null;

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title="פרטי משתמש"
      actions={
        !user.isApproved ? (
          <Button
            variant="contained"
            onClick={() => onApprove(user.id)}
            disabled={approving}
            sx={{ minWidth: 120 }}
          >
            {approving ? "מאשר..." : "אשר משתמש"}
          </Button>
        ) : undefined
      }
    >
      <Field label="שם">{user.name}</Field>
      <Field label="אימייל">{user.email}</Field>
      <Field label="תפקיד">{roleLabel[user.role] ?? user.role}</Field>
      <Field label="סטטוס">
        {user.isApproved ? (
          <Chip label="מאושר" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
        ) : (
          <Chip label="ממתין לאישור" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />
        )}
      </Field>
      <Field label="תאריך הרשמה">{new Date(user.createdAt).toLocaleDateString("he-IL")}</Field>
    </GenericModal>
  );
};

export default UserDetailsModal;
