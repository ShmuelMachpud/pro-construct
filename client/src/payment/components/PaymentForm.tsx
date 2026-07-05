import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Lock } from "@mui/icons-material";
import { cardSx } from "../../auth/helpers/register.styles";

interface PaymentFormProps {
  onCreateSubscription: () => Promise<string>;
  onApprove: (subscriptionId: string) => Promise<void>;
  loading: boolean;
  error: string;
}

const PaymentForm = ({ onCreateSubscription, onApprove, loading, error }: PaymentFormProps) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="white">פרטי תשלום</Typography>
        <Typography variant="body2" color="grey.400" mt={0.5} textAlign="center">
          השלם את המינוי דרך PayPal
        </Typography>
      </Box>

      {isPending || loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (

        // Wraps the official PayPal Buttons component from @paypal/react-paypal-js.
        // The two callbacks are injected by the useRegister hook, keeping this
        // component free of business logic.
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "subscribe" }}
          // Asks our backend to create the subscription and returns its id
          // to the PayPal SDK, which opens the approval popup
          createSubscription={async () => {
            const subscriptionId = await onCreateSubscription();
            return subscriptionId;
          }}
          // Fires after the user approved the payment inside PayPal
          onApprove={async (data) => {
            await onApprove(data.subscriptionID!);
          }}
          onError={() => {
            console.error("PayPal error");
          }}
        />
      )}

      {error && (
        <Typography color="error" textAlign="center" fontSize="0.9rem" mt={2}>{error}</Typography>
      )}

      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mt={2}>
        <Lock sx={{ fontSize: 14, color: "grey.600" }} />
        <Typography variant="caption" color="grey.600">תשלום מאובטח דרך PayPal</Typography>
      </Box>
    </Paper>
  );
};

export default PaymentForm;