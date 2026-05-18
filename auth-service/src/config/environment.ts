import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3001,
  DB_URL: process.env.DB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
};
