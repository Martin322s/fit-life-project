# Fit Life

Fit Life is a full-stack fitness and nutrition tracking application for Bulgarian-speaking users. It helps users register and manage a profile, track meals and calories, log weight and body progress, follow workouts and training plans, explore recipes and diets, join challenges, track hydration, and browse nutrition products.

The project is structured as a **Node.js monorepo** with a **unified full-stack Next.js app** (web UI + backend API) and an Expo mobile app.

```
fit-life-project/
+-- web/      Unified full-stack app — Next.js web UI + /api/* route handlers + Drizzle DB
+-- mobile/   Mobile app — Expo + React Native
```

## Architecture

### Production-Intended Architecture

The capstone-required architecture is **one Next.js application** that contains both the web frontend and the backend REST API:

```
Web browser  ──[Server Actions + same-origin /api/*]──▶  web/ Next.js app
                                                               │
                                                               ├── src/app/*          (web pages)
                                                               ├── src/app/api/*      (REST API routes)
                                                               ├── src/app/actions/*  (Server Actions)
                                                               ├── src/db/            (Drizzle schema + seeds)
                                                               └── src/lib/server/    (auth, JWT, repos, storage)
                                                               │
Expo mobile  ──[REST /api/* over HTTPS]─────────────────────▶  same app (public REST API)
                                                               │
                                                               ▼
                                                        Neon PostgreSQL + Cloudflare R2
```

### Communication Patterns

| Client | How it calls the backend | Why |
|---|---|---|
| Web (Next.js pages) | **Server Actions** (`src/app/actions/`) | Same-process call, no HTTP round-trip, no exposed credentials |
| Web (legacy service calls) | Same-origin `/api/*` fetch | Progressive migration from REST to Server Actions |
| Expo mobile app | `NEXT_PUBLIC_API_BASE_URL/api/*` REST calls | External client requires HTTP; same route handlers |

### Technologies

| Layer | Technology |
|---|---|
| Web + API | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| Mobile | Expo 54, React Native 0.81, Expo Router |
| Database | PostgreSQL (Neon serverless) via Drizzle ORM |
| Auth | JWT (7-day tokens) + bcrypt password hashing |
| Object storage | Cloudflare R2 (user avatars + backups) |
| Email | EmailJS (password reset + contact form) |
| Deployment | Netlify (unified Next.js app), Expo Web / EAS (mobile) |

### Server Actions

Server Actions live in `web/src/app/actions/`. They call the database and auth libraries directly (no HTTP), making them the primary communication channel for the web client:

| Action file | Covers |
|---|---|
| `actions/auth.ts` | login, register, logout, forgotPassword, resetPassword, getMe |
| `actions/profile.ts` | getProfile, updateProfile |
| `actions/catalog.ts` | getRecipes, getProducts, getDiets, getTrainingPlans, getChallenges (all paginated) |
| `actions/progress.ts` | getProgress, createProgress, deleteProgress |

### REST API Routes

All REST API routes are in `web/src/app/api/` and are consumed by the Expo mobile app. The web client also falls back to them for operations not yet covered by Server Actions.

| Group | Routes |
|---|---|
| Auth | `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/logout`, `/api/auth/forgot-password`, `/api/auth/reset-password` |
| Profile | `/api/profile`, `/api/profile/avatar` |
| User data | `/api/meals`, `/api/workouts`, `/api/goals`, `/api/progress`, `/api/hydration` (all with `[id]` sub-routes) |
| Account | `/api/account/password` |
| Catalog | `/api/recipes`, `/api/diets`, `/api/training-plans`, `/api/products`, `/api/challenges` (paginated + search) |
| User challenges | `/api/user-challenges` |
| Admin | `/api/admin/stats`, `/api/admin/users` |
| Contact | `/api/contact` |

## Project Description

Fit Life is designed around everyday health tracking:

- Visitors can view public pages: home, about, contact, recipes, diets, training plans, challenges, products, FAQ, and legal pages.
- Registered users can sign in, edit their profile, set nutrition and fitness goals, log meals, hydration, workouts, and progress entries.
- Admin users can access admin-only routes for user and application management.
- The mobile app gives users a phone-first experience for the same core fitness workflows.

All visible application text is in Bulgarian.

## Database Schema Design

Main tables and relationships:

```mermaid
erDiagram
  users ||--o{ workouts : has
  users ||--o{ meals : logs
  users ||--o{ goals : owns
  users ||--o{ progress_entries : tracks
  users ||--o{ hydration_entries : logs
  users ||--o{ user_challenges : joins
  challenges ||--o{ user_challenges : includes

  users {
    uuid id PK
    text email UK
    text first_name
    text last_name
    text password_hash
    text role
    real weight
    real height_cm
    integer calories_target
    timestamp created_at
    timestamp updated_at
  }

  workouts {
    uuid id PK
    uuid user_id FK
    text title
    text type
    integer duration_minutes
    integer calories_burned
    timestamp created_at
  }

  meals {
    uuid id PK
    uuid user_id FK
    text title
    integer calories
    real protein
    real carbs
    real fat
    timestamp created_at
  }

  goals {
    uuid id PK
    uuid user_id FK
    text title
    real target_value
    real current_value
    text unit
    text status
  }

  progress_entries {
    uuid id PK
    uuid user_id FK
    real weight_kg
    real waist_cm
    text notes
    timestamp created_at
  }

  hydration_entries {
    uuid id PK
    uuid user_id FK
    integer amount_ml
    timestamp created_at
  }

  challenges {
    uuid id PK
    text title
    text category
    text target_type
    real target_value
    text target_unit
  }

  user_challenges {
    uuid id PK
    uuid user_id FK
    uuid challenge_id FK
    text status
    real progress_value
    timestamp started_at
  }

  recipes {
    uuid id PK
    text title
    text category
    integer calories
    jsonb ingredients
    jsonb instructions
  }

  diets {
    uuid id PK
    text title
    text goal_type
    integer duration_days
    integer calories_per_day
    jsonb rules
    jsonb sample_menu
  }

  training_plans {
    uuid id PK
    text title
    text goal_type
    text level
    integer duration_weeks
    jsonb weekly_schedule
  }

  products {
    uuid id PK
    text name
    text category
    text brand
    integer calories
    jsonb tags
  }
```

Content tables (`recipes`, `diets`, `training_plans`, `products`) are global catalog data. User-owned tables reference `users.id` with cascade delete.

## Repository Structure

```text
fit-life-project/
+-- README.md                    Project overview and setup guide
+-- DEPLOYMENT.md                Deployment notes for unified app + mobile
+-- AGENTS.md                    AI agent instructions
+-- BACKUP.md                    Backup system guide
+-- .env.example                 Environment variable reference (copy to web/.env)
+-- .github/workflows/
|   +-- project-backup.yml       Daily DB + R2 backup to private Cloudflare R2 bucket
+-- web/                         Unified full-stack Next.js app (primary deployment)
|   +-- src/app/                 Next.js App Router — web pages + API routes + actions
|   |   +-- api/                 REST API route handlers (35+ endpoints)
|   |   +-- actions/             Server Actions (auth, profile, catalog, progress)
|   |   +-- [page]/page.tsx      Web UI pages (22 pages total)
|   +-- src/db/                  Drizzle schema, DB connection, seed scripts
|   +-- src/lib/server/          Backend logic: auth, JWT, repositories, storage, validation
|   +-- src/views/               Feature view implementations
|   +-- src/layout/              Shared layout components (navbar, footer, sidebar)
|   +-- src/components/          Route guards and shared UI components
|   +-- src/context/             Authentication + theme context
|   +-- src/hooks/               Data and local state hooks
|   +-- src/services/            REST API clients (used by web falls + mobile)
|   +-- drizzle/                 Generated SQL migration files (0000-0013)
|   +-- drizzle.config.ts        Drizzle Kit configuration
|   +-- public/                  Static assets + global stylesheet (fitlife-styles-v2.css)
+-- mobile/                      Expo mobile app
|   +-- app/                     Expo Router screens (auth group + tabs group + detail screens)
|   +-- src/components/          Shared React Native UI primitives
|   +-- src/context/             Authentication context
|   +-- src/services/            REST API service wrappers (calls web/ /api/* routes)
|   +-- src/types/               Shared TypeScript types
|   +-- src/theme.ts             Dark theme tokens
```

## Local Development Setup

### Requirements

- Node.js 18+
- Neon PostgreSQL database (or local PostgreSQL)
- Expo Go on your phone (optional, for mobile testing)

### Clone the Repository

```bash
git clone https://github.com/Martin322s/fit-life-project.git
cd fit-life-project
```

### 1. Unified Next.js App (web + API)

```bash
cd web
npm install
```

Copy the environment variable reference and fill in your values:

```bash
cp ../.env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, R2 credentials, EmailJS keys, etc.
```

Key variables:

```
DATABASE_URL=postgresql://...         # Neon connection string
JWT_SECRET=...                        # At least 32 characters
APP_URL=http://localhost:3000         # Used in password-reset email links
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # For Expo mobile app
```

Prepare the database:

```bash
npm run db:migrate
npm run db:seed
npm run db:seed:full   # seeds recipes, diets, plans, products, challenges, 10K+ rows
```

Start:

```bash
npm run dev
```

Runs on `http://localhost:3000` — serves both web pages and `/api/*` endpoints.

### 2. Mobile App

```bash
cd mobile
npm install
npm run start
```

Press `a` for Android emulator, `i` for iOS simulator, `w` for Expo web, or scan the QR code with Expo Go.

The mobile app reads `NEXT_PUBLIC_API_BASE_URL` (set in `web/.env`) to reach the API. During development it points to `http://localhost:3000`.

### Test Accounts

| Role | Email | Password |
|---|---|---|
| User | `peter@abv.bg` | `asd123asd` |
| Admin | `admin@fitlife.bg` | `admin1234` |

The "Forgot Password" functionality sends a real email. Use an accessible email address to receive the reset link.

---

## Scalability & Performance

### Server-side pagination

Every catalog endpoint (`/api/recipes`, `/api/products`, `/api/training-plans`, `/api/diets`, `/api/challenges`) supports `?page=` and `?limit=` query parameters. Responses include `{ items, page, limit, total, totalPages }` for efficient client-side paging.

Server Actions in `catalog.ts` expose the same pagination interface for the web client.

### 10,000-row catalog seed

The script `src/db/seed-catalog-load.ts` seeds at least **10,000 rows** into `recipes`, `products`, and `training_plans` by generating variations from a curated base dataset.

```bash
cd web
npm run db:seed:catalog-load
# or use the combined command:
npm run db:seed:full
```

### Database indexes

Migration `0013_catalog_performance_indexes` adds:

| Table | Index type | Columns |
|---|---|---|
| `recipes` | B-tree | `(category, difficulty)`, `created_at DESC` |
| `training_plans` | B-tree | `(goal_type, level)`, `level`, `created_at DESC` |
| `products` | B-tree | `(category, created_at DESC)`, `(category, protein DESC)` |
| `recipes` | GIN / trgm | `title`, `description` — full-text search |
| `products` | GIN / trgm | `name`, `description`, `brand` — full-text search |
| `training_plans` | GIN / trgm | `title`, `description` — full-text search |

GIN / trgm indexes require the `pg_trgm` extension (enabled by default on Neon).

### Neon serverless PostgreSQL

The backend targets [Neon](https://neon.tech/), a serverless PostgreSQL provider that scales compute to zero when idle and scales automatically under load — matching the serverless Netlify deployment model.

### Cloudflare R2 object storage

User avatar images are stored in Cloudflare R2 (`src/lib/server/storage.ts`), keeping binary assets out of the database. R2 also stores daily backup archives (see `BACKUP.md`).

---

## Hosted

- Web (unified app): <https://fitlife-com.netlify.app/>
- Android APK: <https://expo.dev/accounts/martin13s18/projects/fit-life/builds/4d49c3a1-48dd-484b-bded-2e005690cbb3>

## Download the Mobile App

Scan this QR code to download the Android APK directly to your phone.

<img src="mobile-app-qr.svg" alt="QR code for downloading the Fit Life Android app" style="display:block;width:min(520px,100%);height:auto;" />
