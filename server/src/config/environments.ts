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
  // MESHULAM_USER_ID: process.env.MESHULAM_USER_ID || "",
  // MESHULAM_PAGE_CODE: process.env.MESHULAM_PAGE_CODE || "",
  // APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:3000",
};
