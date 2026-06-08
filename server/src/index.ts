import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./config/database";
import { ENV } from "./config/environments";
import { router } from "./routes";
import { logger } from "./utils/logger";
import { handleServerError } from "./middleware/handleServerError.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { handleError } from "./utils/handleError";
import { CustomError } from "./utils/customError";

const app = express();

app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());

app.use("/api", router);
app.use("/{*path}", (req: Request, res: Response) =>
  handleError(new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404), res),
);

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
