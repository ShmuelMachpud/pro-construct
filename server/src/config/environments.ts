import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "prodaction",
  PORT: process.env.PORT || "3000",
  DB_URL: process.env.DB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || "",
};

export const ENV_PAYPAL = {
  BASE_URL: process.env.PAYPAL_BASE_URL || "",
  CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  MONTHLY_PLAN_ID: process.env.PAYPAL_MONTHLY_PLAN_ID || "",
  YEARLY_PLAN_ID: process.env.PAYPAL_YEARLY_PLAN_ID || "",
  RETURN_URL: process.env.PAYPAL_RETURN_URL || "",
  CANCEL_URL: process.env.PAYPAL_CANCEL_URL || "",
};
