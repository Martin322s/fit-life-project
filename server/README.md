# FitLife — Server

Next.js 16 App Router backend that serves as the REST API for both the web client and the mobile app.

## Tech Stack

- **Next.js 16** (App Router, API Routes only — no frontend pages)
- **TypeScript 5**
- **Drizzle ORM 0.45** — schema, migrations, seeding
- **Neon PostgreSQL** (serverless driver with WebSocket support)
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth
- **EmailJS** — password reset and contact emails

## Project Structure

```
server/
├── app/
│   └── api/               # All REST endpoints
│       ├── auth/          # login, register, logout, me, forgot-password, reset-password
│       ├── account/       # password change
│       ├── admin/         # users CRUD, stats (admin-only)
│       ├── meals/         # meal tracking
│       ├── hydration/     # hydration tracking
│       ├── progress/      # weight/progress entries
│       ├── goals/         # user goals
│       ├── workouts/      # workout logs
│       ├── recipes/       # recipe catalog
│       ├── diets/         # diet plan catalog
│       ├── training-plans/# training plan catalog
│       ├── products/      # nutrition product catalog
│       ├── challenges/    # challenge catalog
│       ├── user-challenges/# user challenge enrollment
│       ├── profile/       # user profile
│       └── contact/       # contact form
├── db/
│   ├── schema.ts          # Drizzle table definitions
│   ├── seed.ts            # User seed
│   └── seed-*.ts          # Feature-specific seed scripts
├── drizzle/               # Generated migration SQL files
├── lib/                   # Shared helpers (auth, db client, etc.)
├── middleware.ts           # CORS + JWT verification middleware
├── drizzle.config.ts      # Drizzle Kit config
└── .env.local             # Local environment variables
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```env
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://...

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3001
MOBILE_URL=
CORS_ALLOWED_ORIGINS=

EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_ACCESS_TOKEN=

CONTACT_EMAILJS_SERVICE_ID=
CONTACT_EMAILJS_TEMPLATE_ID=
CONTACT_EMAILJS_PUBLIC_KEY=
CONTACT_EMAILJS_ACCESS_TOKEN=
CONTACT_TO_EMAIL=
```

CORS is built from `CLIENT_URL`, `SERVER_URL`, `MOBILE_URL`, and `CORS_ALLOWED_ORIGINS`. In non-production mode, localhost origins are added automatically.

## Setup & Development

```bash
npm install

# Apply all pending migrations
npm run db:migrate

# Seed the database (run once for initial data)
npm run db:seed
npm run db:seed:recipes
npm run db:seed:diets
npm run db:seed:products
npm run db:seed:training-plans
npm run db:seed:challenges

# Start the dev server (port 3001)
npm run dev
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Start production server (port 3000) |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate new migration files from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:push` | Push schema directly (no migration files — dev only) |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |
| `npm run db:seed` | Seed users |
| `npm run db:seed:recipes` | Seed recipe catalog |
| `npm run db:seed:diets` | Seed diet plan catalog |
| `npm run db:seed:products` | Seed nutrition products |
| `npm run db:seed:training-plans` | Seed training plan catalog |
| `npm run db:seed:challenges` | Seed challenges |

## Authentication

All protected routes require a `Bearer <token>` header. Tokens are JWTs signed with `JWT_SECRET`. The `middleware.ts` file verifies the token on every request and attaches the decoded user to the request context. Admin endpoints additionally check for the `admin` role.

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Get JWT token |
| POST | `/api/auth/logout` | — | Invalidate session |
| GET | `/api/auth/me` | JWT | Restore session |
| POST | `/api/auth/forgot-password` | — | Send reset email |
| POST | `/api/auth/reset-password` | — | Reset with token |
| GET/POST | `/api/meals` | JWT | Meal log |
| GET/POST | `/api/hydration` | JWT | Hydration log |
| GET/POST | `/api/progress` | JWT | Weight/progress entries |
| GET/POST | `/api/workouts` | JWT | Workout logs |
| GET/POST | `/api/goals` | JWT | User goals |
| GET | `/api/recipes` | JWT | Recipe catalog |
| GET | `/api/diets` | JWT | Diet plan catalog |
| GET | `/api/training-plans` | JWT | Training plan catalog |
| GET | `/api/products` | JWT | Nutrition products |
| GET | `/api/challenges` | JWT | Challenge catalog |
| GET/POST | `/api/user-challenges` | JWT | Challenge enrollment |
| GET/PATCH | `/api/profile` | JWT | User profile |
| PATCH | `/api/account/password` | JWT | Change password |
| POST | `/api/contact` | — | Contact form |
| GET | `/api/admin/users` | Admin | List all users |
| GET/PATCH/DELETE | `/api/admin/users/[id]` | Admin | Manage user |
| GET | `/api/admin/stats` | Admin | Platform stats |

## Production Deployment

1. Create a Neon PostgreSQL database.
2. Set all environment variables in your hosting provider.
3. `npm install`
4. `npm run db:migrate`
5. Run seed scripts if the database needs initial catalog data.
6. `npm run build`
7. `npm run start`

See the root [DEPLOYMENT.md](../DEPLOYMENT.md) for the full guide and smoke test checklist.
