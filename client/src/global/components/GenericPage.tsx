import type { ReactNode } from "react";
import { Box } from "@mui/material";

const DEFAULT_BG = "/proconstruct.jpg";

interface GenericPageProps {
  children: ReactNode;
  backgroundImage?: string;
}

const GenericPage = ({ children, backgroundImage = DEFAULT_BG }: GenericPageProps) => (
  <Box
    sx={{
      display: "flex",
      minHeight: "100vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.7)" }} />
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {children}
    </Box>
  </Box>
);

export default GenericPage;
