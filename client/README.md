# FitLife — Web Client

React 19 + TypeScript + Vite single-page application. Talks to the FitLife server API and is the primary surface for the web experience including the admin panel.

## Tech Stack

- **React 19** with React Compiler enabled
- **TypeScript 5.9**
- **Vite 8** (build tool, dev server)
- **React Router 7** (client-side routing)
- **ESLint 9** with TypeScript + React Hooks plugins

## Project Structure

```
client/
├── src/
│   ├── components/     # Shared route guards (AdminRoute, GuestRoute, PrivateRoute)
│   ├── context/        # AuthContext — global auth state
│   ├── hooks/          # Data-fetching hooks per feature
│   ├── layout/         # Navbar, Footer, Sidebar, MainLayout
│   ├── lib/            # Utility helpers (calculators, label maps)
│   └── pages/          # Feature pages (Dashboard, Calories, Weight, Recipes, …)
├── public/             # Static assets
├── index.html
├── vite.config.ts
└── .env                # VITE_API_BASE_URL
```

## Environment Variables

Create `client/.env` (copy from `client/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3001
```

For production point this to the deployed server URL.

## Setup & Development

```bash
npm install
npm run dev
```

App runs at http://localhost:5173.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and produce production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Production Build

```bash
npm run build
```

The output is in `dist/`. Deploy `dist/` to any static host.

For Netlify, `public/_redirects` already contains `/* /index.html 200` for SPA routing. For Vercel or other hosts, configure an equivalent fallback rewrite to `/index.html`.

## Route Overview

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing / home |
| `/login` `/register` | Guest only | Auth pages |
| `/forgot-password` | Guest only | Password reset request |
| `/dashboard` | Auth | Main dashboard |
| `/calories` | Auth | Meal & calorie tracking |
| `/weight` | Auth | Weight / progress tracking |
| `/recipes` | Auth | Recipe browser |
| `/diets` | Auth | Diet plans |
| `/training-plans` | Auth | Training plan browser |
| `/products` | Auth | Nutrition products |
| `/challenges` | Auth | Fitness challenges |
| `/calculators` | Auth | BMI, TDEE, and other calculators |
| `/profile` | Auth | User profile |
| `/admin` | Admin only | User & stat management |
