import { useState } from "react";
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { CalendarMonth, CreditCard, Lock, Person } from "@mui/icons-material";
import { CreditCardPreview } from "./CreditCardPreview";
import { cardSx } from "../../auth/helpers/register.styles";
import { formatCardNumber, formatExpiry } from "../helpers/payment.helpers";
import type { PaymentFormType } from "../types/payment.types";

interface PaymentFormProps {
  values: PaymentFormType;
  setValue: (key: keyof PaymentFormType, value: string) => void;
  errors: Partial<Record<keyof PaymentFormType, string>>;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

const adornment = (icon: React.ReactNode) => ({
  input: { startAdornment: <InputAdornment position="start">{icon}</InputAdornment> },
});

const PaymentForm = ({ values, setValue, errors, onSubmit, loading, error }: PaymentFormProps) => {
  const [cvvFocused, setCvvFocused] = useState(false);

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <CreditCard sx={{ color: "primary.main", fontSize: 36, mb: 1 }} />
        <Typography variant="h4" fontWeight="bold" color="white">פרטי תשלום</Typography>
        <Typography variant="body2" color="grey.400" mt={0.5} textAlign="center">
          הכרטיס יחויב רק לאחר אישור חשבונך
        </Typography>
      </Box>

      <CreditCardPreview
        cardNumber={values.cardNumber}
        cardHolder={values.cardHolder}
        expiry={values.expiry}
        cvv={values.cvv}
        flipped={cvvFocused}
      />

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          label="מספר כרטיס"
          value={values.cardNumber}
          onChange={(e) => setValue("cardNumber", formatCardNumber(e.target.value))}
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          slotProps={{
            ...adornment(<CreditCard sx={{ color: "grey.600", fontSize: 20 }} />),
            htmlInput: { maxLength: 19, inputMode: "numeric" },
          }}
        />
        <TextField
          fullWidth
          label="שם בעל הכרטיס"
          value={values.cardHolder}
          onChange={(e) => setValue("cardHolder", e.target.value.toUpperCase())}
          error={!!errors.cardHolder}
          helperText={errors.cardHolder}
          slotProps={adornment(<Person sx={{ color: "grey.600", fontSize: 20 }} />)}
        />
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="תוקף (MM/YY)"
            value={values.expiry}
            onChange={(e) => setValue("expiry", formatExpiry(e.target.value))}
            error={!!errors.expiry}
            helperText={errors.expiry}
            slotProps={{
              ...adornment(<CalendarMonth sx={{ color: "grey.600", fontSize: 20 }} />),
              htmlInput: { maxLength: 5, inputMode: "numeric" },
            }}
          />
          <TextField
            fullWidth
            label="CVV"
            value={values.cvv}
            onChange={(e) => setValue("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            onFocus={() => setCvvFocused(true)}
            onBlur={() => setCvvFocused(false)}
            error={!!errors.cvv}
            helperText={errors.cvv}
            slotProps={{
              ...adornment(<Lock sx={{ color: "grey.600", fontSize: 20 }} />),
              htmlInput: { maxLength: 4, inputMode: "numeric" },
            }}
          />
        </Box>

        {error && (
          <Typography color="error" textAlign="center" fontSize="0.9rem">{error}</Typography>
        )}

        <Button fullWidth variant="contained" onClick={onSubmit} disabled={loading} sx={{ py: 1.5, mt: 1 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "שמור פרטי תשלום"}
        </Button>

        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          <Lock sx={{ fontSize: 14, color: "grey.600" }} />
          <Typography variant="caption" color="grey.600">תשלום מאובטח ומוצפן בתקן PCI-DSS</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PaymentForm;
