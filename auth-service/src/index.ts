import "reflect-metadata";
import express from "express";
import { corsMiddleware } from "./middleware/cors.middleware";
import { router } from "./routes";
import { AppDataSource } from "./config/database";
import { logger } from "./utils/logger";
import { ENV } from "./config/environment";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { handleServerError } from "./middleware/handleServerError.middleware";

const app = express();

app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use("/api", router);

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(ENV.PORT, () =>
      logger.info(`Server running on port ${ENV.PORT}`),
    );
  })
  .catch((error) => {
    logger.error(
      `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  });

app.use(handleServerError);
