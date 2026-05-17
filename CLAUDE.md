# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**pro-construct** is a construction project management web application. It is a monorepo with two packages:
- `/client` — React 19 + TypeScript + Vite frontend
- `/server` — Express 5 + TypeScript + TypeORM backend with PostgreSQL

## Commands

### Client (`/client`)
```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Server (`/server`)
```bash
npm run dev      # Start with nodemon (watches src/, restarts on .ts changes)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled output
```

Server requires a `.env` file with `PORT`, `DB_URL`, and `JWT_SECRET`.

## Architecture

### Backend (`/server/src`)

Uses a layered **routes → controller → service → DAL** pattern per feature module.

- `middleware/` — `authenticate` (JWT validation) and `authorize` (role check)
- `auth/` — Registration and login only; DAL imports `User` from `users/model/`
- `users/` — User management: listing, contractor approval; entity: `User` (includes UserRole + SubscriptionStatus enums)
- `clients/` — Client CRUD; entity: `Client`
- `projects/` — Project CRUD; entity: `Project`
- `billing/` — Subscription management and payment history (planned; entity: `PaymentHistory`)
- `config/database.ts` — TypeORM PostgreSQL data source (entities: User, Client, Project)
- `config/environments.ts` — Loads env vars

**User roles**: `ADMIN` (מנהל המערכת), `OPERATOR` (עובד מטעם המנהל), `CONTRACTOR` (קבלן — המשתמש בפועל)

**Approval flow**: קבלן נרשם עם `isApproved: false`. לוגין חסום עד שמנהל (ADMIN בלבד) מאשר דרך `PATCH /api/users/:id/approve`.

**Subscription flow**: קבלן בוחר תוכנית (`monthly` / `annual`) בהרשמה ומספק מספר כרטיס מדומה — paymentToken נוצר מיד. ADMIN מאשר → `subscriptionStatus = ACTIVE`, `subscriptionEndDate` מחושב לפי התוכנית (+1 חודש / +12 חודשים).

**Auth flow**: `POST /api/auth/login` returns a JWT → client stores it in `localStorage` → sent as `Authorization: Bearer <token>` on every request → backend middleware validates and attaches the user to `req`.

### Frontend (`/client/src`)

Feature-based module structure. Each module contains:

```
src/
├── global/
│   ├── components/       ← reusable generic components (GenericForm, GenericTable, GenericModal, GenericPage)
│   ├── hooks/            ← reusable hooks (useAuth, useForm)
│   ├── services/         ← axios instance with JWT interceptors
│   ├── router.tsx        ← React Router v7 setup; wraps private routes in ProtectedRoute
│   └── theme.ts          ← Material-UI v7 theme with RTL (stylis-plugin-rtl)
├── auth/
│   ├── pages/
│   ├── components/
│   │   └── register/     ← קומפוננטות הרשמה מרובת שלבים (RegisterForm, RegistrationStep, PaymentStep, SuccessStep, PlanSelector)
│   ├── hooks/
│   ├── helpers/          ← register.helpers.ts, register.styles.ts
│   ├── services/
│   └── types/
├── users/
│   ├── pages/
│   ├── components/       ← AllUsersTable, PendingUsersTable, UserDetailsModal
│   ├── hooks/            ← useAllUsers, usePendingUsers, useApproveUser
│   ├── helpers/          ← users.helpers.ts (label/color maps), users.columns.tsx (column defs)
│   ├── services/
│   └── types/
├── billing/
│   └── services/         ← billing.service.ts (tokenize)
├── clients/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
└── projects/
    ├── pages/
    ├── components/
    ├── hooks/
    ├── services/
    └── types/
```

## Frontend Conventions

### 1 — Component responsibility (Single Responsibility)

Every component does **one thing only**. A page component is the single root component for that route — it composes other components but contains no logic of its own. Business logic, data fetching, normalization, and service calls belong exclusively in hooks.

```
LoginPage           ← renders the page layout, delegates to LoginForm
  └── LoginForm     ← renders the form UI, calls useLogin hook
        └── useLogin  ← owns the logic: calls auth service, handles errors, navigates
```

### 2 — Generic reusable components live in `global/components/`

Components that may be used across more than one module (e.g. `<AppForm>`, `<AppTable>`, `<AppPage>`, `<AppModal>`) must be generic — no business-domain props — and placed in `src/global/components/`. Module-specific components stay inside `<module>/components/`.

### 3 — Components never call services or contain logic

Page, tile, card, table, and form **component files must not**:
- import or call service functions directly
- contain `useState` / `useEffect` for data fetching
- perform data normalization or transformation

All of the above belongs in a **hook** (`<module>/hooks/use<Feature>.ts`). The component receives data and callbacks as props (or calls the hook at the top level and passes results down). The rule: if you need to remove a `console.log`, open the hook — not the component.

### API Endpoints

**Auth**
| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/auth/register` | No | — (יוצר קבלן, ממתין לאישור) |
| POST | `/api/auth/login` | No | — |

**Users**
| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/users` | Yes | ADMIN, OPERATOR |
| GET | `/api/users/pending` | Yes | ADMIN, OPERATOR |
| GET | `/api/users/:id` | Yes | ADMIN, OPERATOR |
| PATCH | `/api/users/:id/approve` | Yes | ADMIN |
| ~~PATCH~~ | ~~`/api/users/:id`~~ | | ~~ADMIN, OPERATOR~~ — not yet implemented |

**Clients**
| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/clients` | Yes | CONTRACTOR, OPERATOR |
| GET | `/api/clients/:id` | Yes | CONTRACTOR, OPERATOR |
| POST | `/api/clients` | Yes | CONTRACTOR |
| PUT | `/api/clients/:id` | Yes | CONTRACTOR |
| DELETE | `/api/clients/:id` | Yes | CONTRACTOR |

**Projects**
| Method | Path | Auth | Roles |
|--------|------|------|-------|
| GET | `/api/projects` | Yes | CONTRACTOR, OPERATOR |
| GET | `/api/projects/:id` | Yes | CONTRACTOR, OPERATOR |
| POST | `/api/projects` | Yes | CONTRACTOR |

**Billing**
| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/billing/tokenize` | Yes | CONTRACTOR — שומר כרטיס ללא חיוב, מחזיר token |
| GET | `/api/billing/history` | Yes | CONTRACTOR — היסטוריית תשלומים |

### Registration & Subscription Flow

**plan: "monthly" / "annual"** — הרשמה כוללת תשלום מיידי:
1. `POST /api/auth/register` עם `plan: "monthly" | "annual"` + `mockCardNumber`
2. Server יוצר `paymentToken` (`mock_tok_<email>_<timestamp>`) ושומר על ה-User
3. קבלן ממתין לאישור ADMIN
4. ADMIN מאשר → `subscriptionStatus = ACTIVE`, `subscriptionStartDate = now`, `subscriptionEndDate = +1 חודש / +12 חודשים`

**סיום מנוי** → `subscriptionStatus = INACTIVE` → קריאה בלבד (GET מותר)
