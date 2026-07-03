# CashWise

CashWise is a modern personal finance tracking application built as a Monorepo. It features a React (Vite) frontend with a sleek UI built using Tailwind CSS and Recharts, and a powerful NestJS backend utilizing Prisma 7 as its ORM.

## Architecture

This project is organized as an npm workspaces monorepo with two main applications:

### 1. Frontend (`apps/frontend`)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4) with standard classes, prioritizing a vibrant green primary theme (`#16A34A`), modern typography, and clean layouts.
- **Components:** Fully responsive components including a dynamic Dashboard, Expense tracker, Categories, and Groups.
- **Forms & Validation:** React Hook Form integrated with Zod.
- **Charts:** Recharts for dynamic visual statistics.

### 2. Backend (`apps/backend`)
- **Framework:** NestJS
- **Database ORM:** Prisma 7 using the explicitly configured `@prisma/adapter-pg` driver adapter.
- **Database:** PostgreSQL
- **API Documentation:** Swagger UI built-in.
- **Static Serving:** In production mode, the NestJS backend statically serves the compiled frontend assets from its `public` directory, running both the API and the React application on a single port.

## Getting Started

### Prerequisites
- Node.js (v24+ recommended)
- PostgreSQL database

### Installation

1. **Clone the repository** and install dependencies at the root level (this will install dependencies for both the frontend and backend using npm workspaces):
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory (or inside `apps/backend`) and provide your database connection URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/cashwise"
   ```

3. **Database Setup:**
   Run the Prisma migrations to apply the schema to your database:
   ```bash
   cd apps/backend
   npx prisma migrate dev
   npx prisma generate
   cd ../..
   ```

## Development

To run both the frontend (Vite) and backend (NestJS) servers concurrently in development mode with hot-reloading:

```bash
npm run dev
```
- **Frontend Development Server:** Typically available on `http://localhost:5173`
- **Backend API Server:** Available on `http://localhost:3000`

## Production Build & Start

The production build script compiles the React frontend, copies the static assets into the backend's `public` directory, and then compiles the NestJS backend.

1. **Build the full project:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm run start:prod
   ```

The application will now be running entirely from the backend server!
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **API Endpoints:** `/api/*`

## API Documentation (Swagger)

The backend exposes a fully auto-generated Swagger UI containing documentation for all the API endpoints.

When the backend server is running (either in development or production mode), you can access the Swagger documentation at:

👉 **[http://localhost:3000/api](http://localhost:3000/api)**
