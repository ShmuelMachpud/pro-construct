import cors from "cors";
import { ENV } from "../config/environments";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (origin && ENV.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
});
