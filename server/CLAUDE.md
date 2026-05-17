# Project Conventions

## Stack
Express.js + TypeScript server.

## Server File Structure

```
src/
├── index.ts                            ← app bootstrap, middleware order
├── routes/
│   └── index.ts                        ← central router: mounts module routers + 404 catch-all
├── middleware/
│   ├── auth.middleware.ts              ← authenticate, authorize
│   ├── auth.types.ts                   ← AuthPayload, AuthRequest
│   ├── cors.middleware.ts              ← CORS with ALLOWED_ORIGINS allowlist
│   ├── requestLogger.middleware.ts     ← logs every incoming request (method, url, status, duration)
│   └── handleServerError.middleware.ts ← global error-handler (4-arg express middleware)
├── utils/
│   ├── logger.ts                       ← colored logger: info / warn / error / debug
│   ├── customError.ts                  ← CustomError class (message + status)
│   └── handleError.ts                  ← shared catch-block helper for controllers
├── config/
│   ├── database.ts
│   └── environments.ts                 ← ENV.PORT, DB_URL, JWT_SECRET, ALLOWED_ORIGINS
├── auth/
│   ├── model/                          ← (empty — User entity lives in users/model/)
│   ├── routes/                         ← POST /register, POST /login only
│   ├── controllers/
│   ├── services/
│   ├── dal/                            ← findUserByEmail, createUser only (imports User from users/model/)
│   ├── helpers/
│   └── types/                          ← RegisterDto (plan: "monthly"|"annual", mockCardNumber), LoginDto
├── users/
│   ├── model/
│   │   └── user.entity.ts              ← User entity + UserRole + SubscriptionStatus enums (shared with auth DAL)
│   ├── routes/                         ← GET /, GET /pending, GET /:id, PATCH /:id/approve
│   ├── controllers/
│   ├── services/
│   ├── dal/                            ← findAllUsers, findUserById, findPendingContractors, setUserApproved
│   ├── helpers/
│   │   └── users.normalized.ts         ← normalizedUser, normalizedUsers (strips password, selects client fields)
│   └── types/                          ← UserForClient
├── billing/
│   ├── model/
│   │   └── payment-history.entity.ts  ← PaymentHistory entity + PaymentStatus enum
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── dal/
│   ├── helpers/
│   └── types/
├── clients/
│   ├── model/
│   │   └── client.entity.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── dal/
│   ├── helpers/
│   └── types/
└── projects/
    ├── model/
    │   └── project.entity.ts
    ├── routes/
    ├── controllers/
    ├── services/
    ├── dal/
    ├── helpers/
    └── types/
```

## Layer Responsibilities

| Layer | File | Responsibility |
|---|---|---|
| `model/` | `<module>.entity.ts` | TypeORM entity + enums for this domain |
| `routes/` | `<module>.router.ts` | Express Router, define endpoints, attach middleware |
| `controllers/` | `<module>.controller.ts` | Parse req/res, call service, return response |
| `services/` | `<module>.service.ts` | Business logic, orchestration between DAL calls |
| `dal/` | `<module>.dal.ts` | DB queries only — no business logic |
| `helpers/` | `<module>.helpers.ts` | Pure utility functions specific to this module |
| `types/` | `<module>.types.ts` | Interfaces, types, enums for this module |

## Naming Conventions

- Entity files: `<module>.entity.ts` — e.g. `user.entity.ts`, `client.entity.ts`
- Other file names: `<module>.<layer>.ts` — e.g. `clients.service.ts`, `projects.dal.ts`
- Routers: export a named `const <module>Router = Router()`
- Controllers: named functions, not default export — e.g. `export const getClientById = ...`
- Services / DAL: named exports only, no default exports

## Rules

- **Never** put business logic in controllers — controllers only handle req/res parsing and call service functions
- **Never** call DAL directly from a controller — always go through the service layer
- **Never** import from another module's `dal/` directly — go through that module's `service/`
- Each layer imports only from the layer below it (routes → controllers → services → dal)
- **Types only in types files** — interfaces and types must not be defined in middleware, service, controller, or DAL files. Place them in the module's `types/<module>.types.ts`, or for middleware-level types in `middleware/auth.types.ts`
- Shared middleware lives in `src/middleware/` — not inside any module
- Entity files (`model/`) may be imported by other modules that need the type (e.g. a relation)
- **Single-statement `if` blocks must be written on one line without braces** — when an `if` contains exactly one statement (typically a guard clause that `throw`s a `CustomError`), drop the braces and write it inline. Example: `if (!user) throw new CustomError("User not found", 404);` — not a multi-line block.

## When Adding a New Module

Always create all 7 subdirectories (`model/`, `routes/`, `controllers/`, `services/`, `dal/`, `helpers/`, `types/`) even if some are initially empty — keep the structure consistent.

After creating the module's router, **register it in `src/routes/index.ts`** under the appropriate path — module routers must not be mounted directly in `src/index.ts`.

## Error Handling

Three pieces work together:

1. **`CustomError`** ([`utils/customError.ts`](src/utils/customError.ts)) — `new CustomError(message, status)`. Use this for every expected error a service can produce. Pick the right HTTP status (404 not found, 400 bad input, 401 unauthorized, 403 forbidden, 409 conflict, etc.).
2. **`handleError(err, res)`** ([`utils/handleError.ts`](src/utils/handleError.ts)) — called from every `catch` block in controllers. If `err` is a `CustomError`, sends its `status` + `message`. Otherwise logs the real message and returns a generic 500 to the client.
3. **`handleServerError`** ([`middleware/handleServerError.middleware.ts`](src/middleware/handleServerError.middleware.ts)) — registered last in `index.ts`. Safety net for anything that escapes a controller (uncaught throws, errors from middleware). Same logic as `handleError` but at the express-middleware level.

### Service convention

Every service function must be wrapped in `try / catch` that re-throws as `Promise.reject`:

```ts
export const getProjectByIdService = async (id: number, contractorId: string): Promise<Project> => {
  try {
    const project = await getProjectById(id, contractorId);
    if (!project) throw new CustomError("Project not found", 404);
    return project;
  } catch (error) {
    return Promise.reject(error);
  }
};
```

Throw `CustomError` directly inside the `try` — it propagates through the `catch` unchanged.

### Controller convention

Every controller method uses `handleError` in its catch — never inline `res.status(...).json(...)` for errors:

```ts
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await getProjectByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json(project);
  } catch (error) {
    handleError(error, res);
  }
};
```

The status code now comes from the `CustomError` thrown by the service — controllers do not hard-code error statuses.

## Routing

- All module routers (`authRouter`, `clientsRouter`, `projectsRouter`, etc.) are mounted in the central router at [`src/routes/index.ts`](src/routes/index.ts), not in `index.ts`.
- `index.ts` mounts the central router once under `/api`:
  ```ts
  app.use("/api", router);
  ```
- The central router ends with a catch-all that returns 404 via `handleError`:
  ```ts
  router.use((req, res) =>
    handleError(new CustomError(`Route not found: ${req.method} ${req.originalUrl}`, 404), res)
  );
  ```
  This must remain the last `router.use(...)` in the file.

## Logger

[`src/utils/logger.ts`](src/utils/logger.ts) — small colored logger. Always use it instead of `console.*`. Format: `[TAG] <ISO date> <message>`.

- `logger.info(message)` — green tag
- `logger.warn(message)` — yellow tag
- `logger.error(message)` — red tag
- `logger.debug(message)` — cyan tag

`message` must be a `string`. To include an `Error` object or other value, format it explicitly (template literal, `err.message`, `String(value)`).

`handleError` and `handleServerError` already log through this logger — do not log the same error a second time at the call site.

## CORS

[`src/middleware/cors.middleware.ts`](src/middleware/cors.middleware.ts) reads the allowlist from `ENV.ALLOWED_ORIGINS`. Only requests whose `Origin` header is present **and** in the list are allowed — bare `curl`/Postman requests (no `Origin`) are also rejected.

To allow a new origin, add it to `.env`:
```
ALLOWED_ORIGINS=http://localhost:5173,https://app.example.com
```
Comma-separated; whitespace around each entry is trimmed.

## Cross-Cutting Utilities

Truly cross-cutting helpers (not specific to one module) live in [`src/utils/`](src/utils/) — `logger`, `customError`, `handleError`. Per-module helpers still go in `<module>/helpers/`.

## Middleware Order in `index.ts`

The order matters. Keep it as:

```ts
app.use(corsMiddleware);           // before any route
app.use(requestLogger);            // log every incoming request (after CORS so blocked origins aren't logged)
app.use(express.json());           // body parsing
app.use("/api", router);           // all module routes (incl. /api/* 404)
app.use(handleServerError);        // last — global error safety net
```
