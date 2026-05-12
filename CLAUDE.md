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
- `auth/` — Registration, login, user approval; entity: `User`
- `clients/` — Client CRUD; entity: `Client`
- `projects/` — Project CRUD; entity: `Project`
- `config/database.ts` — TypeORM PostgreSQL data source (entities: User, Client, Project)
- `config/environments.ts` — Loads env vars

**User roles**: `ADMIN` (מנהל המערכת), `OPERATOR` (עובד מטעם המנהל), `CONTRACTOR` (קבלן — המשתמש בפועל)

**Approval flow**: קבלן נרשם עם `isApproved: false`. לוגין חסום עד שמנהל/אופרטור מאשרים דרך `PATCH /api/auth/users/:id/approve`.

**Auth flow**: `POST /api/auth/login` returns a JWT → client stores it in `localStorage` → sent as `Authorization: Bearer <token>` on every request → backend middleware validates and attaches the user to `req`.

### Frontend (`/client/src`)

Feature-based module structure:

- `auth/` — Login page and auth service
- `projects/` — Project list page and creation components
- `global/components/` — `Layout`, `Header`, `Sidebar`, `ProtectedRoute`
- `global/services/` — Axios instance with JWT interceptors (reads token from localStorage)
- `global/router.tsx` — React Router v7 setup; wraps private routes in `ProtectedRoute`
- `global/theme.ts` — Material-UI v7 theme with RTL support (stylis-plugin-rtl)

### API Endpoints

| Method | Path | Auth | Roles |
|--------|------|------|-------|
| POST | `/api/auth/register` | No | — (יוצר קבלן, ממתין לאישור) |
| POST | `/api/auth/login` | No | — |
| GET | `/api/auth/pending` | Yes | ADMIN, OPERATOR |
| PATCH | `/api/auth/users/:id/approve` | Yes | ADMIN, OPERATOR |
| GET | `/api/projects` | Yes | CONTRACTOR, OPERATOR |
| GET | `/api/projects/:id` | Yes | CONTRACTOR, OPERATOR |
| POST | `/api/projects` | Yes | CONTRACTOR |
