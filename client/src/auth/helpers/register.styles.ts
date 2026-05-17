import type { SxProps, Theme } from "@mui/material";

export const cardSx: SxProps<Theme> = {
  p: 5,
  width: 460,
  backgroundColor: "rgba(30,30,30,0.85)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,107,0,0.3)",
  borderRadius: 3,
};
