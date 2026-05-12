# Project Conventions

## Stack
Express.js + TypeScript server.

## Server File Structure

Every domain module lives under `server/<module>/` with this exact structure:

```
server/
├── clients/
│   ├── routes/
│   │   └── clients.router.ts
│   ├── controllers/
│   │   └── clients.controller.ts
│   ├── services/
│   │   └── clients.service.ts
│   ├── dal/
│   │   └── clients.dal.ts
│   ├── helpers/
│   │   └── clients.helpers.ts
│   └── types/
│       └── clients.types.ts
├── projects/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── dal/
│   ├── helpers/
│   └── types/
└── ...
```

## Layer Responsibilities

| Layer | File | Responsibility |
|---|---|---|
| `routes/` | `<module>.router.ts` | Express Router, define endpoints, attach middleware |
| `controllers/` | `<module>.controller.ts` | Parse req/res, call service, return response |
| `services/` | `<module>.service.ts` | Business logic, orchestration between DAL calls |
| `dal/` | `<module>.dal.ts` | DB queries only — no business logic |
| `helpers/` | `<module>.helpers.ts` | Pure utility functions specific to this module |
| `types/` | `<module>.types.ts` | Interfaces, types, enums for this module |

## Naming Conventions

- File names: `<module>.<layer>.ts` — e.g. `clients.service.ts`, `projects.dal.ts`
- Routers: export a named `const <module>Router = Router()`
- Controllers: named functions, not default export — e.g. `export const getClientById = ...`
- Services / DAL: named exports only, no default exports

## Rules

- **Never** put business logic in controllers — controllers only handle req/res parsing and call service functions
- **Never** call DAL directly from a controller — always go through the service layer
- **Never** import from another module's `dal/` directly — go through that module's `service/`
- Each layer imports only from the layer below it (routes → controllers → services → dal)
- Shared types across modules go in `server/shared/types/`
- Shared middleware goes in `server/shared/middleware/`

## When Adding a New Module

Always create all 6 subdirectories (`routes/`, `controllers/`, `services/`, `dal/`, `helpers/`, `types/`) even if some are initially empty — keep the structure consistent.
