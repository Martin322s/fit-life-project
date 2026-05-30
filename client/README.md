# FitLife — Unified Full-Stack App

Next.js 15 + React 19 + TypeScript application that serves **both the web UI and the `/api/*` REST endpoints** from a single deployment. The web frontend communicates with the backend via Server Actions (same process, no HTTP). The Expo mobile app communicates via the REST API routes.

## Tech Stack

- **Next.js 15** App Router — web pages + API route handlers
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4** — utility classes + legacy `fitlife-styles-v2.css`
- **Drizzle ORM** + **Neon PostgreSQL** — database
- **bcryptjs** + **jsonwebtoken** — auth
- **Cloudflare R2** (AWS S3 SDK) — object storage
- **EmailJS** — password reset + contact form
- **Netlify** (single site) — deployment

## Architecture

```
Web browser  ──[Server Actions]──▶  src/app/actions/   ──▶  src/lib/server/  ──▶  Neon DB
Expo mobile  ──[REST /api/*]─────▶  src/app/api/       ──▶  src/lib/server/  ──▶  Neon DB
```

## Project Structure

```text
client/
+-- src/
|   +-- app/
|   |   +-- api/          REST API route handlers (35+ endpoints — for Expo mobile app)
|   |   +-- actions/      Server Actions (auth, profile, catalog, progress — for web)
|   |   +-- [page]/       Web UI pages (23 pages)
|   +-- db/               Drizzle schema, DB connection, seed scripts
|   +-- lib/
|   |   +-- server/       Auth, JWT, repositories, R2 storage, validation helpers
|   |   +-- (other)       Frontend utilities: calculators, label maps
|   +-- views/            Feature view implementations and section components
|   +-- layout/           MainLayout, DashboardLayout, Navbar, Footer
|   +-- components/       Shared route guards and UI components
|   +-- context/          AuthContext + ThemeContext
|   +-- hooks/            Data-fetching and local state hooks
|   +-- services/         REST API client modules (same-origin — no base URL)
+-- drizzle/              Generated SQL migration files (0000–0013)
+-- drizzle.config.ts     Drizzle Kit configuration
+-- postcss.config.mjs    Tailwind v4 PostCSS plugin
+-- public/               Static assets + fitlife-styles-v2.css
+-- next.config.ts        Next.js configuration (no proxy rewrite — API routes are local)
+-- netlify.toml          Netlify build configuration
```

## Environment Variables

Copy `../.env.example` to `client/.env` and fill in your values.

Required for local development:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=at-least-32-chars
APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_BASE_URL` is read by the Expo mobile app to reach `/api/*`. For web-only use, the API calls are same-origin and need no base URL.

## Setup & Development

```bash
npm install
npm run db:migrate   # apply Drizzle migrations
npm run db:seed      # seed demo users
npm run db:seed:full # seed all catalogs (+ 10K rows)
npm run dev          # http://localhost:3000 (web + /api/*)
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server — web UI + API routes on `localhost:3000` |
| `npm run build` | Production Next.js build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed demo users |
| `npm run db:seed:full` | Seed all catalogs + 10K performance rows |
| `npm run db:studio` | Open Drizzle Studio |

## Test Accounts

| Role | Email | Password |
|---|---|---|
| User | `peter@abv.bg` | `asd123asd` |
| Admin | `admin@fitlife.bg` | `admin1234` |

The "Forgot Password" flow sends a real email via EmailJS. Use an accessible email address to receive the reset link.

## Route Overview

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/about` | Public | About page |
| `/contact` | Public | Contact page |
| `/faq` | Public | FAQ |
| `/privacy` `/terms` `/cookies` | Public | Legal pages |
| `/login` `/register` | Guest only | Authentication |
| `/forgot-password` `/reset-password` | Guest only | Password reset |
| `/dashboard` | Auth | Main dashboard |
| `/calories` | Auth | Meal + calorie tracking |
| `/weight` | Auth | Weight + progress tracking |
| `/recipes` `/diets` `/training-plans` | Auth | Content catalogs |
| `/products` `/challenges` `/calculators` | Auth | Tools + challenges |
| `/profile` | Auth | User profile |
| `/admin` | Admin only | User + stats management |

## Production Deployment

Single Netlify site — configured via `netlify.toml` and `@netlify/plugin-nextjs`. See `DEPLOYMENT.md` for full instructions.
