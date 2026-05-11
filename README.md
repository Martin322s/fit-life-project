# FitLife

FitLife is a full-stack fitness tracking application for Bulgarian-speaking users. It consists of three surfaces that share a single REST API backend.

## Project Structure

```
fit-life-project/
├── server/   # Next.js API backend (port 3001 dev / 3000 prod)
├── client/   # React + Vite web app (port 5173)
└── mobile/   # Expo / React Native app (iOS, Android, Web)
```

## Technologies

| Layer | Stack |
|---|---|
| Server | Next.js 16 (App Router), TypeScript, Drizzle ORM, Neon PostgreSQL, JWT, EmailJS |
| Client | React 19, TypeScript, Vite 8, React Router 7, React Compiler |
| Mobile | Expo 54, React Native 0.81, Expo Router 6, AsyncStorage |

## Features

- Authentication — register, login, logout, session restore, forgot/reset password
- Dashboard — calories & meals, weight/progress tracking, hydration
- Content — recipes, diets, training plans, nutrition products, challenges, calculators
- Profile management
- Admin panel (web only) — user and stat management
- Contact form via EmailJS

## Prerequisites

- Node.js 18+
- npm 9+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)
- Expo CLI (`npm install -g expo-cli`) for mobile

## Quick Start

### 1. Environment files

Copy each example and fill in real values:

```bash
cp server/.env.example server/.env.local
cp client/.env.example client/.env
cp mobile/.env.example mobile/.env   # create manually if not present
```

Minimum required values:

```env
# server/.env.local
JWT_SECRET=your-secret
DATABASE_URL=postgresql://...
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3001

# client/.env
VITE_API_BASE_URL=http://localhost:3001

# mobile/.env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
# For Android emulator use: http://10.0.2.2:3001
# For physical device use: http://YOUR_LAN_IP:3001
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install
```

### 3. Prepare the database

```bash
cd server
npm run db:migrate
npm run db:seed
```

### 4. Start all services

Open three terminal windows:

```bash
# Terminal 1 — API server
cd server && npm start

# Terminal 2 — Web client
cd client && npm run dev

# Terminal 3 — Mobile app
cd mobile && npm start
```

- Web client: http://localhost:5173
- API server: http://localhost:3001
- Mobile: scan the QR code in the Expo terminal with Expo Go

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment steps, all environment variables, seed commands, and a smoke test checklist.

## Mobile APK (Android)

Pre-built APK: https://expo.dev/accounts/martin13s18/projects/fit-life/builds/ec050589-bc7a-4f19-918f-3ee2fb0ecaab

## Backup System

FitLife includes a simple database backup system for disaster recovery and data protection.

### What it does

- Exports the entire PostgreSQL database to a timestamped `.sql` file
- Saves backups to `server/backups/database/backup-YYYY-MM-DD-HH-mm.sql`
- Uses `pg_dump` when available, or a Node.js `pg`-based export as fallback
- Includes a cleanup script that removes backups older than 7 days

### Run a backup manually

```bash
cd server
npm run backup:db
```

Example output:
```
[backup] FitLife Database Backup
[backup] File: backup-2025-05-11-14-30.sql
[backup] Connected to: postgresql://***:***@host/db
[backup] Tables: users, recipes, diets, ...
[backup] Done!  backup-2025-05-11-14-30.sql  (142.3 KB)
```

### Clean up old backups

```bash
cd server
npm run backup:clean
```

Removes any `.sql` files older than 7 days from `server/backups/database/`.

### Automating backups (future)

For scheduled backups in production, you can run `npm run backup:db` on a schedule:

**Windows Task Scheduler:**
```
Action: node C:\path\to\server\scripts\backups\backup-db.js
Trigger: Daily at 02:00
```

**Linux/macOS cron job** (add via `crontab -e`):
```
0 2 * * * cd /path/to/server && npm run backup:db
```

**GitHub Actions** (CI/CD, example `.github/workflows/backup.yml`):
```yaml
on:
  schedule:
    - cron: '0 2 * * *'   # every day at 02:00 UTC
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd server && npm ci && npm run backup:db
```

### Notes

- Backup `.sql` files are git-ignored. Only the directory structure is tracked.
- If `pg_dump` is not installed, the script falls back to a Node.js export automatically.
- To install PostgreSQL client tools (for pg_dump): https://www.postgresql.org/download/

## Notes

- Never commit real `.env` files.
- The server runs on port 3001 in dev mode (`npm run dev`) and port 3000 in production (`npm run start`). Align your `VITE_API_BASE_URL` accordingly.
- All user-facing copy is in Bulgarian.
- Admin routes are web-only and restricted to admin-role JWT tokens.
