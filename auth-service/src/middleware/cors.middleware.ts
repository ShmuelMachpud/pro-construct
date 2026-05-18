import cors from "cors";
import { ENV } from "../config/environment";

const allowedOrigins = ENV.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins.includes(origin))
      return callback(new Error("Not allowed by CORS"));
    callback(null, true);
  },
});
