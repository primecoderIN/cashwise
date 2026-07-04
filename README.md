# CashWise

CashWise is a modern personal finance tracking application built as an **npm workspaces monorepo**. It features a React (Vite) frontend and a NestJS backend serving the API and static frontend in production.

---

## System Architecture

CashWise operates on a decoupled client-server architecture during development, but compiles down to a single-server deployment in production.

### High-Level Flow
1. **Client Layer**: The user interacts with the React frontend (Vite).
2. **State & Fetching**: TanStack React Query handles caching and remote data fetching.
3. **Authentication**: Clerk handles user identity and JWT issuance.
4. **API Layer**: Requests are sent to the NestJS backend, authorized via a global AuthGuard that verifies the Clerk JWT.
5. **Data Layer**: NestJS services use Prisma ORM to interact with the PostgreSQL database.

### Monorepo Structure (npm workspaces)

```
cashwise/
├── apps/
│   ├── frontend/          # React 19 + Vite + TailwindCSS v4 + shadcn/ui
│   └── backend/           # NestJS 11 + Prisma 7 + PostgreSQL
├── packages/
│   ├── shared-types/      # Interfaces shared across frontend and backend
│   ├── shared-constants/  # Reusable constants
│   └── shared-utils/      # Helper utilities
├── scripts/
│   └── copy-frontend.js   # Production build orchestration script
└── package.json           # Root workspace config defining workspaces
```

The Monorepo setup allows the frontend and backend to seamlessly share DTOs and types (from `packages/shared-types`), ensuring type safety across the network boundary.

### Frontend (`apps/frontend`)
The frontend is a Single Page Application (SPA) structured around feature components.
| Tech | Purpose |
|---|---|
| **React 19 + Vite** | High-performance UI framework and dev server. |
| **TailwindCSS v4 + shadcn/ui** | Atomic styling and accessible, unstyled component primitives. |
| **Clerk (`@clerk/clerk-react`)** | Provides the `<ClerkProvider>` and UI components for seamless login. |
| **TanStack Query** | Manages server state, handles loading/error states, and invalidates caches. |
| **Recharts** | Renders dynamic financial charts for the dashboard. |
| **React Hook Form + Zod** | Strongly-typed form validation. |

### Backend (`apps/backend`)
The backend is a REST API built on NestJS's modular architecture.
| Tech | Purpose |
|---|---|
| **NestJS 11** | Provides dependency injection, routing, and guards (AuthGuard). |
| **Prisma 7** | Type-safe ORM for database migrations and queries. |
| **PostgreSQL** | Relational database (connected via `@prisma/adapter-pg`). |
| **`@clerk/backend`** | Verifies JWT tokens on incoming requests. |
| **`@nestjs/serve-static`** | In production, serves the compiled React app alongside the API. |
| **`@nestjs/swagger`** | Generates interactive API documentation (dev only). |

### Authentication Flow
1. User logs in on the frontend using Clerk's pre-built UI.
2. Clerk provides a short-lived Session JWT.
3. The frontend passes this token in the `Authorization: Bearer <token>` header for API requests.
4. The NestJS backend `AuthGuard` extracts the token and uses `@clerk/backend` to verify its signature and expiration.
5. If valid, the user's `clerkId` is attached to the request object. If the user doesn't exist in the database yet, they are created automatically.

### Production Deployment Architecture
To simplify deployment, CashWise avoids needing two separate hosting services:
1. `npm run build` runs `tsc` and `vite build` on the frontend.
2. The `copy-frontend.js` script copies the frontend static files (`dist`) into the backend's `public` directory.
3. The backend is compiled.
4. When `start:prod` is run, a single Node.js process spins up. NestJS serves API requests on `/api/*` and uses `@nestjs/serve-static` to serve the React SPA on all other routes.

---

## Prerequisites

- **Node.js** v20+ (v24 recommended)
- **PostgreSQL** database (local or cloud, e.g. [Neon](https://neon.tech))
- **Clerk account** — [clerk.com](https://clerk.com) (free tier works)

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/primecoderIN/cashwise.git
cd cashwise
npm install
```

### 2. Configure Environment Variables

Create a `.env` file at the **root** of the monorepo:

```env
# ── Clerk Authentication ───────────────────────────────────────
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...   # Frontend: Vite exposes this to React
CLERK_SECRET_KEY=sk_test_...             # Backend: used to verify JWT tokens

# ── Database ───────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/cashwise?sslmode=require"

# ── Server ─────────────────────────────────────────────────────
PORT=3000            # Optional, defaults to 3000
NODE_ENV=development # Set to "production" in prod to hide Swagger
```

> **Note**: The frontend uses `VITE_CLERK_PUBLISHABLE_KEY` (Vite env prefix). The backend uses `CLERK_SECRET_KEY`.

### 3. Run Database Migrations

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```

---

## Development

Run both frontend (Vite) and backend (NestJS) simultaneously with hot-reload:

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger UI | http://localhost:3000/api/docs *(dev only)* |

To run only the backend:

```bash
npm run start:dev -w backend
```

---

## Production Build & Deploy

The production build compiles React, copies assets into `apps/backend/public`, then compiles NestJS. The NestJS server then serves everything on a single port.

```bash
# 1. Build everything
npm run build

# 2. Start the production server
npm run start:prod
```

| Endpoint | URL |
|---|---|
| App (Frontend) | http://localhost:3000 |
| REST API | http://localhost:3000/api/* |
| Swagger | ❌ Hidden in production |

---

## API Documentation (Swagger)

Swagger is **only available in development mode** (`NODE_ENV !== 'production'`).

Start the backend in dev mode and navigate to:

👉 **http://localhost:3000/api/docs**

The Swagger UI includes all routes for:
- `Dashboard` — Summary, charts, recent expenses
- `Categories` — CRUD for expense categories
- `Expenses` — CRUD for expenses
- `Groups` — CRUD for expense groups

All endpoints require a **Bearer token** from Clerk. Obtain one via the browser DevTools → Application → Cookies, or use the Swagger `Authorize` button.

---

## Project Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run frontend + backend in dev mode |
| `npm run build` | Build frontend → copy → build backend |
| `npm run start:prod` | Start production server |
| `npm run build -w frontend` | Build frontend only |
| `npm run build -w backend` | Build backend only |
| `npm run lint --workspaces` | Lint all workspaces |

---

## Database Schema

```
User          ──< Expense
User          ──< Category
User          ──< ExpenseGroup
Expense  >──  Category
Expense  >──  ExpenseGroup (optional)
```

Key design decisions:
- Users are identified by `clerkId` (from Clerk JWT `sub` claim)
- On first login, a `User` row is automatically created in the DB
- All data is scoped to the `userId` (DB UUID) — never the Clerk ID directly
