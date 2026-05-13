import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import { ENV } from "./config/environments";
import { router } from "./routes";
import { logger } from "./utils/logger";
import { handleServerError } from "./middleware/handleServerError.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use("/api", router);

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(ENV.PORT, () => {
      logger.info(`Server running on port ${ENV.PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error?.message ?? error}`);
    process.exit(1);
  });
app.use(handleServerError);
