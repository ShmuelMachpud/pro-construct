import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { theme } from "./global/theme";
import App from "./App";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
                <PayPalScriptProvider options={{
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
          vault: true,
          intent: "subscription",
        }}>

        <App />
        </PayPalScriptProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);