import { Box, Typography, Chip, Button } from "@mui/material";
import GenericModal from "../../global/components/GenericModal";
import { roleLabel, subscriptionLabel, subscriptionColor, formatDate } from "../helpers/users.helpers";
import type { UserInterface } from "../types/users.types";

interface UserDetailsModalProps {
  user: UserInterface | null;
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
          <Button variant="contained" onClick={() => onApprove(user.id)} disabled={approving} sx={{ minWidth: 120 }}>
            {approving ? "מאשר..." : "אשר משתמש"}
          </Button>
        ) : undefined
      }
    >
      <Field label="שם">{user.name}</Field>
      <Field label="אימייל">{user.email}</Field>
      {user.phone && <Field label="טלפון">{user.phone}</Field>}
      {user.companyName && <Field label="שם החברה">{user.companyName}</Field>}
      {user.companyId && <Field label='ח"פ / עוסק מורשה'>{user.companyId}</Field>}
      {user.address && <Field label="כתובת">{user.address}</Field>}
      <Field label="תפקיד">{roleLabel[user.role] ?? user.role}</Field>
      <Field label="סטטוס אישור">
        {user.isApproved
          ? <Chip label="מאושר" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
          : <Chip label="ממתין לאישור" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />}
      </Field>

      {user.role === "contractor" && (
        <>
          {/* <Field label="תוכנית נבחרת">
            {user.wantsImmediatePayment
              ? <Chip label="תשלום מיידי" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
              : <Chip label="ניסיון חינמי" size="small" sx={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }} />}
          </Field> */}
          <Field label="כרטיס אשראי שמור">
            {user.paymentToken
              ? <Chip label="קיים" size="small" sx={{ backgroundColor: "rgba(76,175,80,0.15)", color: "#4CAF50" }} />
              : <Chip label="אין" size="small" sx={{ backgroundColor: "rgba(158,158,158,0.15)", color: "#9E9E9E" }} />}
          </Field>
          {user.subscriptionStatus && (
            <Field label="סטטוס מנוי">
              <Chip
                label={subscriptionLabel[user.subscriptionStatus]}
                size="small"
                sx={{
                  backgroundColor: `${subscriptionColor[user.subscriptionStatus]}22`,
                  color: subscriptionColor[user.subscriptionStatus],
                }}
              />
            </Field>
          )}
          {user.subscriptionEndDate && <Field label="חידוש מנוי">{formatDate(user.subscriptionEndDate)}</Field>}
        </>
      )}

      <Field label="תאריך הרשמה">{formatDate(user.createdAt)}</Field>
    </GenericModal>
  );
};

export default UserDetailsModal;
