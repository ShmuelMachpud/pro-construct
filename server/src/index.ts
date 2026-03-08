import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import { ENV } from "./config/environments";
import projectRoutes from "./project/project.routes";
import authRoutes from "./auth/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });