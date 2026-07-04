# CashWise

CashWise is a modern personal finance tracking application built as an **npm workspaces monorepo**. It features a React (Vite) frontend and a NestJS backend serving the API and static frontend in production.

---

## Architecture

```
cashwise/
├── apps/
│   ├── frontend/          # React 19 + Vite + TailwindCSS v4 + shadcn/ui
│   └── backend/           # NestJS 11 + Prisma 7 + PostgreSQL
├── packages/
│   ├── shared-types/      # Shared TypeScript interfaces
│   ├── shared-constants/  # Shared constants
│   └── shared-utils/      # Shared utility functions
├── scripts/
│   └── copy-frontend.js   # Copies frontend dist → backend/public after build
└── package.json           # Root workspace config
```

### Frontend (`apps/frontend`)
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework + dev server |
| TailwindCSS v4 + shadcn/ui | Styling and components |
| Clerk (`@clerk/clerk-react`) | Authentication |
| TanStack Query | Server state / data fetching |
| Recharts | Dashboard charts |
| React Hook Form + Zod | Form validation |

### Backend (`apps/backend`)
| Tech | Purpose |
|---|---|
| NestJS 11 | HTTP framework |
| Prisma 7 | ORM (uses Driver Adapter pattern) |
| `@prisma/adapter-pg` | PostgreSQL driver adapter (required by Prisma 7) |
| `@clerk/backend` | JWT token verification |
| `@nestjs/serve-static` | Serves compiled React app in production |
| `@nestjs/swagger` | API docs (development only) |

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
