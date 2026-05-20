# Shared Microservices Documentation

## Stack

Express.js + TypeScript

---

## Architecture

### Server Bootstrap (`src/index.ts`)

The main entry point registers all global middleware (CORS, body parsing, router, error handler), then initializes the database connection.

- **DB connection succeeds** → server starts listening, logs success
- **DB connection fails** → logs the error, process exits

### Directory Structure

```
src/
├── index.ts               ← app bootstrap: middleware registration, DB init, server start
├── config/
│   ├── environment.ts     ← reads and exports env vars (PORT, DB_URL, etc.)
│   └── database.ts        ← DB connection / DataSource (initialized once, imported by DALs)
├── middleware/
│   ├── cors.middleware.ts          ← CORS configuration
│   ├── requestLogger.middleware.ts ← logs method, path, status, duration
│   └── handleServerError.middleware.ts ← Express 4-param error handler
├── routes/
│   └── index.ts           ← central router: mounts all module routers + 404 catch-all
├── utils/
│   ├── logger.ts          ← application logger
│   ├── customError.ts     ← CustomError class
│   └── handleError.ts     ← shared error handler for controllers
├── helpers/               ← shared domain helpers used across multiple modules
└── <module>/              ← one directory per domain (users, projects, clients, ...)
    ├── model/             ← entity definitions (when needed)
    ├── routes/
    ├── controllers/
    ├── services/
    ├── dal/
    ├── helpers/
    └── types/
```

### Module Structure

Each domain is a self-contained module under `src/`:

```
<module>/
├── model/           ← entity / schema (e.g. user.entity.ts)
├── routes/          ← express router, endpoint definitions
├── controllers/     ← request/response handling
├── services/        ← orchestration, delegates logic to helpers
├── dal/             ← data source communication
├── helpers/         ← business logic and normalization for this module
└── types/           ← TypeScript types and interfaces
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| `routes/` | Define endpoints and attach middleware — nothing else |
| `controllers/` | Parse request, call service, send response — no business logic |
| `services/` | Orchestrate: call DAL + call helpers for logic, normalization, error management |
| `dal/` | Communicate with data source — return raw/primitive data only, no business logic |
| `helpers/` | Implement business logic and normalization — pure functions called by services |
| `types/` | TypeScript interfaces, types, enums for this module |
| `model/` | Entity definitions — imported by DAL and by other modules that need the type |

**Strict layering rule:** each layer imports only from the layer directly below it.

```
routes → controllers → services → dal
                              ↘ helpers
```

### Global vs Module Helpers

| Location | Contains |
|----------|----------|
| `src/helpers/` | Domain helpers shared across multiple modules |
| `src/<module>/helpers/` | Helpers specific to one module only |
| `src/utils/` | Technical infrastructure with no domain knowledge (logger, error handling) |

**Rule:** if a helper can be copied to any other project unchanged — it belongs in `utils/`. If it knows domain concepts (user, subscription, project) but is used in multiple modules — it belongs in `src/helpers/`. If it's used in only one module — it belongs in `<module>/helpers/`.

---

## Conventions

### Functions

- **Single responsibility** — every function does exactly one thing
- **Arrow functions only** — no `function` keyword
- **Generic when reused** — a function used in more than one place must be generic, not duplicated
- **No mutation of parameters** — functions never modify their inputs; return new values instead
- **No file longer than 150 lines**

### Async & Error Handling

- Every async function is wrapped in `try/catch`
- `catch` always returns `Promise.reject(error)` — errors bubble up unchanged until the controller
- Controllers catch errors exclusively via `handleError(error, res)` — never inline `res.status(...).json(...)` for errors
- Use `CustomError(message, status)` for every expected error — pick the right HTTP status (400, 401, 403, 404, 409...)
- Never use `console.log` — always use `logger`

### Single-Line If Statements

When an `if` contains exactly one statement (typically a guard clause), write it on one line without braces:

```ts
if (!user) throw new CustomError("User not found", 404);
if (!token) return Promise.reject(new CustomError("Unauthorized", 401));
```

### TypeScript

- **No `any`** — always define an explicit type
- **`const` by default** — use `let` only when the value must be reassigned
- **No nested ternaries** — maximum one level
- **Destructuring** — prefer destructuring over repeated property access
- **Types in `types/` files only** — interfaces and types must not be defined inline inside service, controller, or DAL files

### Exports & Naming

- **Named exports only** — no default exports in any file
- **No magic strings or numbers** — use enums or named constants
- **Descriptive names** — no generic names like `data`, `temp`, `result`, `res` (outside of Express handler signatures)
- **Layer suffix in function names** — controller functions end with `Controller`, service functions end with `Service`, DAL functions end with `Dal`

### Module Independence

- A module never imports from another module's `dal/` — only from its `service/`
- `model/` files are the only exception: they may be imported by other modules that need the entity type for a relation

### HTTP

- Consistent status codes: `200` GET/PUT, `201` POST, `204` DELETE (no body)
- All error responses return `{ message: string }`
- All success responses return the full entity, not just the `id`

### Environment Variables

- Access env vars only through `config/environment.ts` — never use `process.env` directly anywhere else
