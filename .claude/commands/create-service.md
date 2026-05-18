Scaffold a complete new microservice named `$ARGUMENTS` following the shared architecture and conventions defined in CLAUDE.md.

## Before creating any files, ask the user:

1. **Database?** — Does this service need a database connection (TypeORM + PostgreSQL)?
2. **JWT Auth middleware?** — Does this service need `authenticate` / `authorize` middleware?
3. **Port?** — What port should this service run on?

Wait for the user's answers before proceeding.

---

## Directory structure to create

```
$ARGUMENTS/
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── environment.ts
│   │   └── database.ts        (only if DB = yes)
│   ├── middleware/
│   │   ├── cors.middleware.ts
│   │   ├── requestLogger.middleware.ts
│   │   ├── handleServerError.middleware.ts
│   │   └── auth.middleware.ts  (only if JWT = yes)
│   ├── routes/
│   │   └── index.ts
│   ├── types/
│   │   └── auth.types.ts      (only if JWT = yes)
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── customError.ts
│   │   └── handleError.ts
│   └── helpers/
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
└── tsconfig.json
```

---

## File contents

### `src/index.ts`

**With DB:**
```ts
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
    app.listen(ENV.PORT, () => logger.info(`Server running on port ${ENV.PORT}`));
  })
  .catch((error) => {
    logger.error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });

app.use(handleServerError);
```

**Without DB:**
```ts
import express from "express";
import { corsMiddleware } from "./middleware/cors.middleware";
import { router } from "./routes";
import { logger } from "./utils/logger";
import { ENV } from "./config/environment";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { handleServerError } from "./middleware/handleServerError.middleware";

const app = express();

app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use("/api", router);

app.listen(ENV.PORT, () => logger.info(`Server running on port ${ENV.PORT}`));

app.use(handleServerError);
```

---

### `src/config/environment.ts`

**With DB + JWT:**
```ts
import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || <PORT>,
  DB_URL: process.env.DB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
};
```

Omit `DB_URL` if no DB, omit `JWT_SECRET` if no JWT — only include what the service actually uses.

---

### `src/config/database.ts` (only if DB = yes)

```ts
import { DataSource } from "typeorm";
import { ENV } from "./environment";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENV.DB_URL,
  synchronize: true,
  logging: false,
  entities: [],
});
```

---

### `src/routes/index.ts`

```ts
import { Router } from "express";
import { handleError } from "../utils/handleError";
import { CustomError } from "../utils/customError";

export const router = Router();

// Register module routers here:
// router.use("/users", usersRouter);

router.use((req, res) =>
  handleError(new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404), res)
);
```

---

### `src/middleware/cors.middleware.ts`

```ts
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
```

---

### `src/middleware/requestLogger.middleware.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) logger.error(message);
    else if (res.statusCode >= 400) logger.warn(message);
    else logger.info(message);
  });

  next();
};
```

---

### `src/middleware/handleServerError.middleware.ts`

```ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { CustomError } from "../utils/customError";

export const handleServerError = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    logger.error(`${err.status} ${req.method} ${req.originalUrl} - ${err.message}`);
    res.status(err.status).json({ message: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  logger.error(`500 ${req.method} ${req.originalUrl} - ${message}`);
  res.status(500).json({ message: message || "Internal Server Error" });
};
```

---

### `src/middleware/auth.middleware.ts` (only if JWT = yes)

```ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/environment";
import { CustomError } from "../utils/customError";
import { AuthPayload, AuthRequest } from "../types/auth.types";

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) throw new CustomError("Unauthorized", 401);

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, ENV.JWT_SECRET) as AuthPayload;
    next();
  } catch {
    throw new CustomError("Invalid token", 401);
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      throw new CustomError("Forbidden", 403);
    next();
  };
```

---

### `src/types/auth.types.ts` (only if JWT = yes)

```ts
import { Request } from "express";

export interface AuthPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
```

---

### `src/utils/logger.ts`

```ts
const tag = (color: string, label: string) => `\x1b[${color}m[${label}]\x1b[0m`;

export const logger = {
  info:  (message: string) => console.log(`${tag("32", "INFO")}  ${new Date().toISOString()} ${message}`),
  warn:  (message: string) => console.log(`${tag("33", "WARN")}  ${new Date().toISOString()} ${message}`),
  error: (message: string) => console.log(`${tag("31", "ERROR")} ${new Date().toISOString()} ${message}`),
  debug: (message: string) => console.log(`${tag("36", "DEBUG")} ${new Date().toISOString()} ${message}`),
};
```

---

### `src/utils/customError.ts`

```ts
export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
```

---

### `src/utils/handleError.ts`

```ts
import { Response } from "express";
import { CustomError } from "./customError";
import { logger } from "./logger";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    res.status(error.status).json({ message: error.message });
  } else {
    logger.error(error instanceof Error ? error.message : String(error));
    res.status(500).json({ message: "Internal server error" });
  }
};
```

---

### `nodemon.json`

```json
{
  "watch": ["src", ".env"],
  "ext": "ts,env",
  "exec": "ts-node src/index.ts"
}
```

---

### `src/helpers/.gitkeep`

Empty file to keep the directory tracked by git.

---

### `package.json`

```json
{
  "name": "$ARGUMENTS",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.1",
    "@types/node": "^22.0.0",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
}
```

Add to `dependencies` if DB = yes:
```json
"pg": "^8.13.3",
"reflect-metadata": "^0.2.2",
"typeorm": "^0.3.23"
```

Add to `devDependencies` if DB = yes:
```json
"@types/pg": "^8.11.11"
```

Add to `dependencies` if JWT = yes:
```json
"jsonwebtoken": "^9.0.2"
```

Add to `devDependencies` if JWT = yes:
```json
"@types/jsonwebtoken": "^9.0.9"
```

---

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### `.env.example`

Include only the variables the service actually uses:

```
PORT=<PORT>
DB_URL=postgresql://user:password@localhost:5432/dbname   # if DB = yes
JWT_SECRET=your_secret_here                               # if JWT = yes
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

### `.gitignore`

```
node_modules/
dist/
.env
```

---

## After creating all files

Remind the user to:
1. Run `npm install` inside `$ARGUMENTS/`
2. Copy `.env.example` to `.env` and fill in the values
3. Use `/create-module` to add the first module to this service
