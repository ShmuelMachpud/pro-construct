<div align="center">

# 🏗️ ProConstruct

### Construction Management SaaS — Clients, Projects, Price Quotes & Subscriptions

_A full-stack platform that lets contractors manage their entire business: customers, projects, materials, branded PDF price quotes, and recurring PayPal billing — all in one place._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![MUI](https://img.shields.io/badge/MUI_v7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal_Subscriptions-00457C?style=for-the-badge&logo=paypal&logoColor=white)

</div>

---

## ✨ What is ProConstruct?

ProConstruct is a **multi-tenant SaaS for construction contractors**. A contractor signs up, gets approved by an admin, subscribes via PayPal (monthly/annual), and then manages their whole workflow:

- 👥 **Customers** — full CRM for the contractor's client base
- 🏗️ **Projects** — track every job site and its status
- 🧱 **Materials** — a global materials catalog + per-contractor custom materials & pricing, organized by categories
- 📄 **Price Quotes** — build itemized quotes and generate **branded PDF documents** on the fly (Puppeteer → Supabase Storage)
- 💳 **Billing** — recurring PayPal subscriptions with plan management and full subscription lifecycle (`active`, `past_due`, `cancelled`...)
- 🛡️ **Role-based access** — `admin` / `operator` / `contractor`, with an admin approval flow for new users

The entire UI is **RTL Hebrew-first** (MUI v7 + `stylis-plugin-rtl`), built for the real Israeli construction market.

---

## 🏛️ Architecture

A true **microservices monorepo** — authentication is isolated from business logic, and the frontend talks to both through a JWT-secured API.

```
┌──────────────────────┐
│      client/         │   React 19 · Vite · MUI v7 · React Router v7
│   (SPA, RTL Hebrew)  │   Axios instance with JWT interceptors
└─────────┬────────────┘
          │ HTTPS + JWT
   ┌──────┴───────────────────────┐
   ▼                              ▼
┌────────────────────┐   ┌─────────────────────────────┐
│   auth-service/    │   │         server/             │
│  users · login     │   │  customers · projects       │
│  registration      │   │  materials · price quotes   │
│  admin approval    │   │  PDF engine · PayPal        │
└─────────┬──────────┘   └─────────┬───────────────────┘
          │                        │
          └───────► PostgreSQL ◄───┘        Supabase Storage (PDFs)
                    (TypeORM)
```

### Layered backend — enforced, not aspirational

Every domain module follows the same strict, one-directional flow:

```
routes → controllers → services → dal
                            ↘ helpers
```

| Layer          | Responsibility                                                    |
| -------------- | ----------------------------------------------------------------- |
| `routes/`      | Endpoint definitions + middleware only                            |
| `controllers/` | Parse request → call service → send response. Zero business logic |
| `services/`    | Orchestration: DAL calls + business helpers + error management    |
| `dal/`         | Data access only — raw data in, raw data out                      |
| `helpers/`     | Pure business logic & normalization functions                     |

**Hard rules baked into the codebase:**

- ❌ No `any` — ever
- ❌ No `console.log` — structured `logger` only
- ❌ No `process.env` outside `config/` — single source of environment truth
- ❌ No file over 150 lines — forces single-responsibility
- ✅ Every expected failure is a typed `CustomError(message, httpStatus)` bubbling up to one global error handler
- ✅ Named exports only, no magic strings — enums and constants everywhere
- ✅ Modules never touch each other's DAL — cross-module communication goes through services

### Frontend — the same discipline, client-side

```
pages → components → hooks → services
```

- **Pages** are pure route roots — zero logic
- **All** data fetching, validation and state live in custom hooks (`useLogin`, `useProjects`...)
- Forms are **config-driven**: one `GenericForm` + one `useForm<T>` hook render every form in the app from a declarative field config — adding a new form means writing a type, a config, and a hook. No JSX boilerplate.
- Reusable engine components: `GenericForm`, `GenericTable`, `GenericModal`, `GenericPage`

---

## 🔐 Auth & Billing Flow

```
Register → Admin approval → JWT login → PayPal subscription → Full access
```

1. **Registration** hits the isolated `auth-service`; passwords hashed with **bcrypt**
2. New contractors wait in a **pending state** until an admin approves them
3. Login issues a **JWT** consumed by an Axios interceptor on the client and verified by `authenticate`/`authorize` middleware on every protected route
4. **PayPal Subscriptions API** handles recurring billing — plan resolution (monthly/annual), subscription creation, and status tracking across the full lifecycle

---

## 📄 The PDF Quote Engine

The feature contractors actually sell with: a quote built in the UI becomes a **polished, branded PDF** in seconds.

```
Quote data → HTML template → Puppeteer (headless Chrome) → PDF → Supabase Storage → shareable URL
```

---

## 🧰 Tech Stack

| Area          | Technologies                                                                             |
| ------------- | ---------------------------------------------------------------------------------------- |
| **Frontend**  | React 19, TypeScript, Vite, MUI v7, React Router v7, Axios, Joi, RTL (stylis-plugin-rtl) |
| **Backend**   | Node.js, Express 5, TypeScript, TypeORM, PostgreSQL                                      |
| **Auth**      | JWT, bcrypt, role-based middleware, admin approval flow                                  |
| **Payments**  | PayPal Subscriptions (`@paypal/react-paypal-js` + server-side REST)                      |
| **Documents** | Puppeteer PDF generation, Supabase Storage                                               |
| **Quality**   | ESLint, strict TS, layered architecture with enforced conventions                        |

---

## 🚀 Getting Started

> Prerequisites: Node.js 20+, PostgreSQL, and `.env` files per service (see each service's `src/config/`).

```bash
# 1. Auth service
cd auth-service && npm install && npm run dev

# 2. Main API server
cd server && npm install && npm run dev

# 3. Client
cd client && npm install && npm run dev
```

The client runs on Vite's dev server and proxies API calls to both services.

---

## 📁 Repository Layout

```
pro-construct/
├── auth-service/   # Standalone auth microservice — users, login, registration, approval
├── server/         # Main API — customers, projects, materials, quotes, PDF, PayPal
└── client/         # React SPA — RTL Hebrew UI, config-driven forms, JWT interceptors
```

---

<div align="center">

### 💡 Why this project stands out

**It's not a CRUD demo.** It's a production-shaped SaaS: isolated auth microservice, recurring billing,
headless-browser PDF generation, cloud storage, role-based multi-tenancy — and every line of it
follows a documented architecture that a team could onboard onto in a day.

</div>
