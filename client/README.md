# FitLife - Web Client

Next.js 15 + React 19 + TypeScript web application for the Fit Life platform. It talks to the Fit Life API and includes the public website, authenticated user area, password reset flow, and admin panel.

## Tech Stack

- **Next.js 15** with the App Router
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS 4**
- **ESLint 9** with Next.js config
- **Netlify Next.js plugin** for deployment

## Project Structure

```text
client/
+-- src/
|   +-- app/             Next.js App Router route folders and page wrappers
|   +-- assets/          Client-side static/imported assets
|   +-- components/      Shared route guards and reusable UI components
|   +-- context/         AuthContext and ThemeContext providers
|   +-- hooks/           Data-fetching and local state hooks per feature
|   +-- layout/          MainLayout, dashboard layout, navbar, footer, logo
|   +-- lib/             Utility helpers, calculators, and label maps
|   +-- services/        API clients and API base URL configuration
|   +-- views/           Feature view implementations and section components
+-- public/              Static public assets and global CSS file
+-- next.config.ts       Next.js configuration
+-- netlify.toml         Netlify build/deploy configuration
+-- package.json         Scripts and dependencies
+-- .env                 NEXT_PUBLIC_API_BASE_URL
```

Routes are defined by folders in `src/app/`. Most route files are thin wrappers that render feature implementations from `src/views/`, keeping routing concerns separate from page UI.

## Environment Variables

Create `client/.env` from `client/.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

For production, point this to the deployed API server URL.

## Setup & Development

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 by default.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production Next.js build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run the configured Next.js lint command |

## Test Accounts

Use these accounts when testing authentication flows:

| Role | Email | Password |
|---|---|---|
| User | `peter@abv.bg` | `asd123asd` |
| Admin | `admin@fitlife.bg` | `admin1234` |

The "Forgot Password" functionality works with real email delivery. To test it properly, register with or use an existing email address that you can access, then open the password reset link from that inbox.

## Route Overview

| Path | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/about` | Public | About page |
| `/contact` | Public | Contact page |
| `/faq` | Public | Frequently asked questions |
| `/privacy` `/terms` `/cookies` | Public | Legal pages |
| `/login` `/register` | Guest only | Authentication pages |
| `/forgot-password` | Guest only | Password reset request |
| `/reset-password` | Guest only | Password reset completion |
| `/dashboard` | Auth | Main dashboard |
| `/calories` | Auth | Meal and calorie tracking |
| `/weight` | Auth | Weight and progress tracking |
| `/recipes` | Auth | Recipe browser |
| `/diets` | Auth | Diet plans |
| `/training-plans` | Auth | Training plan browser |
| `/products` | Auth | Nutrition products |
| `/challenges` | Auth | Fitness challenges |
| `/calculators` | Auth | BMI, TDEE, and other calculators |
| `/profile` | Auth | User profile |
| `/admin` | Admin only | User and statistics management |

## Production Build

```bash
npm run build
npm run start
```

Netlify deployment is configured through `netlify.toml` and `@netlify/plugin-nextjs`.
