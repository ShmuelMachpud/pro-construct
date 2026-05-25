import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "3000",
  DB_URL: process.env.DB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL!,
PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID!,
PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET!,
};
