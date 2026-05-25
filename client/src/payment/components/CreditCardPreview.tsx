import { Box, Typography } from "@mui/material";
import { CreditCard } from "@mui/icons-material";

interface CreditCardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
}

const formatCardDisplay = (num: string): string => {
  const raw = num.replace(/\s/g, "").padEnd(16, "•");
  return `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)} ${raw.slice(12, 16)}`;
};

const faceSx = {
  position: "absolute" as const,
  width: "100%",
  height: "100%",
  borderRadius: 3,
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  border: "1px solid rgba(255,107,0,0.35)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden" as const,
};

const CreditCardPreview = ({ cardNumber, cardHolder, expiry, cvv, flipped }: CreditCardPreviewProps) => (
  <Box sx={{ perspective: "1000px", width: "100%", height: 200, mb: 4 }}>
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s ease",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {/* Front */}
      <Box sx={{ ...faceSx, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ width: 48, height: 34, borderRadius: 1, background: "linear-gradient(135deg, #d4af37, #f5e06e)" }} />
          <CreditCard sx={{ color: "rgba(255,107,0,0.75)", fontSize: 40 }} />
        </Box>
        <Typography sx={{ fontFamily: "monospace", fontSize: "1.25rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.9)", textAlign: "center" }}>
          {formatCardDisplay(cardNumber)}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="caption" color="rgba(255,255,255,0.45)" display="block">שם בעל הכרטיס</Typography>
            <Typography sx={{ color: "white", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              {cardHolder || "YOUR NAME"}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="rgba(255,255,255,0.45)" display="block">תוקף</Typography>
            <Typography sx={{ color: "white", fontFamily: "monospace", fontSize: "0.85rem" }}>
              {expiry || "MM/YY"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Back */}
      <Box sx={{ ...faceSx, transform: "rotateY(180deg)", overflow: "hidden" }}>
        <Box sx={{ background: "#111", height: 48, mt: 5, mb: 3 }} />
        <Box display="flex" justifyContent="flex-end" alignItems="center" px={3} gap={1.5}>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">CVV</Typography>
          <Box sx={{ background: "rgba(255,255,255,0.12)", borderRadius: 1, px: 2, py: 0.5, minWidth: 60, textAlign: "center" }}>
            <Typography sx={{ fontFamily: "monospace", color: "white", letterSpacing: "0.2em", fontSize: "1rem" }}>
              {cvv ? "•".repeat(cvv.length) : "•••"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

export { CreditCardPreview };
