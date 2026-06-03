# ProConstruct — Codebase Documentation

## Repository Layout

```
pro-construct/
├── auth-service/   ← standalone auth microservice (users, login, registration, approval)
├── server/         ← main API server (clients, projects, materials, quotes, paypal)
└── client/         ← React frontend (Vite + MUI v7 + React Router v7)
```

---

# Backend Services (auth-service & server)

## Stack

Express.js + TypeScript + TypeORM + PostgreSQL

---

## Architecture

### Server Bootstrap (`src/index.ts`)

The main entry point registers all global middleware (CORS, body parsing, router, error handler), then initializes the database connection.

- **DB connection succeeds** → server starts listening, logs success
- **DB connection fails** → logs the error, process exits

Middleware order — keep it exactly as:

```ts
app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use("/api", router);
app.use(handleServerError);   // last — global error safety net
```

### Directory Structure

```
src/
├── index.ts               ← app bootstrap: middleware registration, DB init, server start
├── config/
│   ├── environment(s).ts  ← reads and exports env vars (PORT, DB_URL, etc.) — never use process.env elsewhere
│   └── database.ts        ← DB connection / DataSource (initialized once, imported by DALs)
├── middleware/
│   ├── auth.middleware.ts          ← authenticate, authorize
│   ├── cors.middleware.ts          ← CORS configuration
│   ├── requestLogger.middleware.ts ← logs method, path, status, duration
│   └── handleServerError.middleware.ts ← Express 4-param error handler
├── routes/
│   └── index.ts           ← central router: mounts all module routers + 404 catch-all
├── types/
│   └── auth.types.ts      ← AuthPayload, AuthRequest, UserRole enum
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
- **No magic strings or numbers** — use enums or named constants (`UserRole.ADMIN` not `"admin"`)
- **Descriptive names** — no generic names like `data`, `temp`, `result`, `res` (outside of Express handler signatures)
- **Layer suffix in function names** — controller functions end with `Controller`, service functions end with `Service`, DAL functions end with `Dal`

### Module Independence

- A module never imports from another module's `dal/` — only from its `service/`
- `model/` files are the only exception: they may be imported by other modules that need the entity type for a relation

### HTTP

- Consistent status codes: `200` GET/PUT/PATCH, `201` POST, `204` DELETE (no body)
- All error responses return `{ message: string }`
- All success responses return the full entity, not just the `id`

### Environment Variables

- Access env vars only through `config/environment(s).ts` — never use `process.env` directly anywhere else

---

# Client (React Frontend)

## Stack

React 19 + TypeScript + Vite + Material-UI v7 + React Router v7

## File Structure

```
src/
├── global/
│   ├── components/         ← reusable generic components (GenericForm, GenericPage, GenericTable, GenericModal)
│   ├── hooks/              ← reusable hooks shared across modules (useAuth, useForm)
│   ├── services/           ← axios instance with JWT interceptors
│   ├── router.tsx          ← React Router v7 setup; wraps private routes in ProtectedRoute
│   └── theme.ts            ← Material-UI v7 theme with RTL (stylis-plugin-rtl)
└── <module>/               ← e.g. auth/, users/, clients/, projects/, billing/
    ├── pages/              ← one root component per route (no logic)
    ├── components/         ← module-specific components (call hooks, render UI)
    │   └── <feature>/      ← sub-folder when a feature has multiple related components
    ├── hooks/              ← all data/logic per feature (use<Feature>.ts)
    ├── helpers/            ← form field configs, column definitions, label/color maps, style constants, pure utils
    ├── services/           ← API call functions only (no state)
    └── types/              ← TypeScript types for this module
```

## Component Rules

1. **Page** = single route root — renders layout and composes components, zero logic.
2. **Logic, data fetching, normalization, service calls** belong exclusively in hooks.
3. **Generic components** in `global/components/` — no business-domain props, named `Generic<Name>`.
4. Components never call services or use `useState`/`useEffect` for data fetching — that belongs in hooks.

## `useForm` — Generic Form Hook

```ts
const { values, setValue, errors, validate, reset } = useForm<MyFormType>(initialData);
```

## `GenericForm` — Config-Driven Form Component

```tsx
<GenericForm
  title="..." subtitle="..." icon={<Icon />}
  infoForm={getFormInfo(values, setValue)}
  onSubmit={handler} submitLabel="..." loading={...} error={...}
/>
```

## `GenericPage` — Full-Screen Background Page Wrapper

```tsx
<GenericPage>          // uses /proconstruct.jpg as default background
<GenericPage backgroundImage="/other.jpg">
```

## Form Pattern — Per Feature

```
<module>/
├── types/<module>.types.ts        ← XxxFormType (exported)
├── helpers/<feature>.helpers.ts   ← initialData + getFormInfo()
├── hooks/use<Feature>.ts          ← useForm<XxxFormType> + service call + validation
├── components/<Feature>Form.tsx   ← GenericForm + hook + helpers
└── pages/<Feature>Page.tsx        ← background/layout + <FeatureForm />
```

## Naming Conventions

| Item | Pattern | Example |
|------|---------|---------|
| Pages | `<Feature>Page.tsx` | `LoginPage.tsx` |
| Components | `<Feature>.tsx` | `LoginForm.tsx` |
| Generic components | `Generic<Name>.tsx` | `GenericForm.tsx` |
| Hooks | `use<Feature>.ts` | `useLogin.ts` |
| Services | `<module>.service.ts` | `auth.service.ts` |
| Types | `<module>.types.ts` | `auth.types.ts` |
| Type names | `<Feature>FormType` | `LoginFormType` |
| Helpers (forms) | `<feature>.helpers.ts` | `register.helpers.ts` |
| Initial data | `<feature>InitialData` | `loginInitialData` |
| Form info fn | `get<Feature>FormInfo` | `getLoginFormInfo` |
