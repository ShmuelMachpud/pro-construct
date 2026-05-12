import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import { ENV } from "./config/environments";
import { projectsRouter } from "./projects/routes/projects.router";
import { authRouter } from "./auth/routes/auth.router";
import { clientsRouter } from "./clients/routes/clients.router";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/clients", clientsRouter);

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
