# FitLife

FitLife is a full-stack fitness tracking capstone project for Bulgarian-speaking users.

## Stack

- `server/` - Next.js App Router API, Drizzle ORM, Neon PostgreSQL, JWT auth.
- `client/` - React + Vite web client.
- `mobile/` - Expo / React Native app.

## Main Features

- Register, login, logout, session restore, forgot password, reset password.
- Dashboard, calories and meals, weight/progress, hydration API, recipes, diets, training plans, nutrition products, challenges, calculators, profile.
- Web-only admin panel for user/stat management.
- Contact and password reset emails through EmailJS.

## Local Setup

```bash
cd server
npm install
npm run db:migrate
npm run build
npm run start
```

```bash
cd client
npm install
npm run dev
```

```bash
cd mobile
npm install
npm run start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for environment variables, production deployment, seed commands, and smoke tests.

## Environment Files

Copy the examples and fill in real values:

- `server/.env.example`
- `client/.env.example`
- `mobile/.env.example`

Never commit real `.env` files.

## Test Credentials

Use seeded accounts if your local database has been seeded, or register a fresh user through the app.
