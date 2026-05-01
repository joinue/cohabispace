# Cohabispace

Modern household management for couples, families, and roommates — chores,
projects, and reminders without the spreadsheet.

## Stack

- **Next.js 16** (App Router, Cache Components, typed routes, Turbopack)
- **React 19** with Server Components, Server Actions, `useActionState`
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives, Base Nova preset)
- **Supabase** (Postgres, Auth, Realtime, Storage) with Row-Level Security
- **Resend** (transactional email)
- **next-themes** (light / dark / system)
- **Zod** for runtime validation at trust boundaries

Hosted on **Vercel**. App Store distribution will come later via a Capacitor
wrap of the same web codebase — no React Native fork.

## Project status

**Phase 1 — Foundation** is in progress. Done so far:

- Auth (email + password): sign-up, sign-in, email confirmation, password reset
- Cookie-refreshing proxy (`src/proxy.ts`)
- Data Access Layer pattern (`src/lib/dal.ts`) with `cache()`-memoized session
- Schema for `profiles`, `households`, `household_members`,
  `household_invitations` with RLS policies, helper functions, and triggers
- Modern component shell, dark mode toggle, base typography

Remaining for Phase 1:

- Household creation flow
- Resend-powered invitations + accept flow
- App shell with multi-household switcher

## Prerequisites

- **Node.js ≥ 20.18** (`.nvmrc` pins to 24)
- **npm 10+**
- A Supabase project (existing: `vqluppczclwevdjpjplw`)
- A Resend account with a verified sending domain
- _Optional but recommended:_ the
  [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
  for migrations and type generation

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Apply the database schema

Two options. The CLI workflow is recommended.

**Option A — Supabase CLI (recommended):**

```bash
npx supabase login
npx supabase link --project-ref vqluppczclwevdjpjplw
npx supabase db push
```

**Option B — Dashboard SQL editor:**

1. Open the Supabase dashboard → **SQL editor**
2. Paste the contents of `supabase/migrations/20260430000001_initial_schema.sql`
3. Run

### 3. Generate typed database client

After the schema is applied:

```bash
npm run db:types
```

This overwrites `src/lib/supabase/database.types.ts` with the generated types.
Until you run it, a hand-written placeholder is used so the project compiles.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in:

| Var                             | Where to get it                                                              |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase dashboard → Project Settings → API → Project URL                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → `anon` `public` key            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase dashboard → Project Settings → API → `service_role` (server only!) |
| `RESEND_API_KEY`                | resend.com → API Keys                                                        |
| `RESEND_FROM_EMAIL`             | Verified sender, e.g. `Cohabispace <hello@yourdomain.com>`                   |
| `NEXT_PUBLIC_APP_URL`           | `http://localhost:3001` for dev (matches `npm run dev` port)                 |

### 5. Configure Supabase Auth redirect URL

In Supabase dashboard → **Authentication → URL Configuration**, add:

- Site URL: `http://localhost:3001`
- Redirect URLs: `http://localhost:3001/api/auth/callback`

When you deploy, add your production URL too.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Scripts

| Script              | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server (Turbopack)                       |
| `npm run build`     | Production build (typechecks, validates routes, prerenders)    |
| `npm run start`     | Run the production build                                       |
| `npm run lint`      | ESLint                                                         |
| `npm run lint:fix`  | ESLint with autofix                                            |
| `npm run format`    | Prettier write                                                 |
| `npm run typecheck` | `tsc --noEmit`                                                 |
| `npm run check`     | Typecheck + lint + format check (run before pushing)           |
| `npm run db:types`  | Regenerate `database.types.ts` from the linked Supabase schema |

## Project structure

```
src/
├── app/                          Next.js App Router
│   ├── (auth)/                   Public auth pages (centered card layout)
│   ├── (app)/                    Authenticated app shell
│   ├── api/auth/callback/        OAuth/email confirmation handler
│   ├── globals.css               Tailwind + shadcn tokens
│   ├── layout.tsx                Root layout (theme provider, fonts, toaster)
│   └── page.tsx                  Public landing
├── components/
│   ├── ui/                       shadcn primitives
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── features/                     Feature folders (vertical slices)
│   └── auth/                     Schemas, server actions, components
├── lib/
│   ├── env/                      Lazy-validated env (client + server-only)
│   ├── supabase/                 Server / browser / service-role clients
│   ├── dal.ts                    Data Access Layer (cached session reads)
│   ├── forms.ts                  Shared form-state helpers
│   └── utils.ts                  cn() and friends
└── proxy.ts                      Next 16 proxy (Supabase session refresh)

supabase/
├── config.toml                   Supabase CLI config
├── migrations/                   Versioned SQL migrations
└── seed.sql                      (Future) seed data
```

## Architecture notes

- **Multi-household membership.** Users belong to many households via
  `household_members`. Switcher comes in the next phase.
- **RLS everywhere.** All household-scoped tables enforce isolation in
  Postgres, not in the app. The `is_household_member` and
  `is_household_admin` SQL helpers do the work; policies stay readable.
- **DAL pattern.** All session reads flow through `src/lib/dal.ts` and use
  React's `cache()` for per-render memoization. Server Actions re-verify the
  session — page-level redirects don't secure the action.
- **Cache Components is on.** Routes that touch request-time data (cookies,
  searchParams) are wrapped in `<Suspense>` so the static shell prerenders.
- **Service-role client (`src/lib/supabase/service.ts`)** bypasses RLS for
  trusted server actions like accepting invitations by token. Never imported
  on the client.
- **`proxy.ts` instead of `middleware.ts`** (Next 16 rename). It refreshes
  the Supabase session cookie on every request and runs `getUser()` (not
  `getSession()`) to revalidate the JWT.

## License

Private — all rights reserved.
