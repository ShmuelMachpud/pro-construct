# Project Conventions

## Stack
Express.js + TypeScript server.

## Server File Structure

```
src/
├── middleware/
│   ├── auth.middleware.ts          ← authenticate, authorize
│   └── auth.types.ts               ← AuthPayload, AuthRequest
├── config/
│   ├── database.ts
│   └── environments.ts
├── auth/
│   ├── model/
│   │   └── user.entity.ts          ← User entity + UserRole enum
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

## When Adding a New Module

Always create all 7 subdirectories (`model/`, `routes/`, `controllers/`, `services/`, `dal/`, `helpers/`, `types/`) even if some are initially empty — keep the structure consistent.
