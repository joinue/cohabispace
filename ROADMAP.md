# Cohabispace — Roadmap & Architecture Notes

_Last updated: 2026-04-30, after Phase 2F._

## What this is

Cohabispace is a household management app for people who live together — couples, families,
roommates. It's a single tool for chores, projects, reminders, and the dozens of small things that
fall through the cracks of group living. The name was chosen because it works for any group of
cohabitants, not just families.

The app is multi-household from day one (one user can be in many) and built as a web app first
(PWA-installable), with a Capacitor wrap planned for iOS App Store later. No React Native fork.

## Status

### Shipped

**Phase 1 — Foundation**

- Email + password auth: sign-up, sign-in, password reset, email confirmation
- Multi-household membership with invitations (Resend, hashed tokens, 7-day expiry, accept/revoke)
- DAL pattern with `cache()`-memoized session reads
- `proxy.ts` (Next 16 rename of middleware) for Supabase session refresh

**Phase 2 — Tasks**

- 2A — CRUD + grouped views (overdue / today / tomorrow / this week / later / no date)
- 2E — Edit drawer + chip-style date and assignee pickers + cursor-pointer fix
- 2G — Spaces (rooms / themes / projects), sidebar nav, `/spaces/[id]`, `/settings/spaces`
- 2B — Recurrence (5 presets via RFC 5545 RRULE, auto-spawn next on complete)
- 2C — Subtasks (`parent_task_id`, drawer Subtasks section, n/m progress badge)
- 2D — Inline `#tag` syntax with click-to-filter pills
- 2F — People sidebar section, `/people/[userId]`, `/completed` history view

### Tech stack

- **Next.js 16** (App Router, Cache Components, typed routes, Turbopack)
- **React 19** with Server Components, Server Actions, `useActionState`
- **TypeScript** (strict + `noUncheckedIndexedAccess`)
- **Tailwind v4** + **shadcn/ui** (Base UI primitives, Base Nova preset)
- **Supabase** (Postgres + Auth + Realtime + Storage) with Row-Level Security
- **Resend** for transactional email
- **rrule** for RFC 5545 recurrence
- **next-themes** light / dark / system
- **Zod** at all trust boundaries

Hosted on Vercel. App Store distribution will use Capacitor over the same web codebase.

## Roadmap

### Phase 3 — Events & reminders (next up)

The second big primitive. Events are date-based things that may or may not require action — tax
day, trash pickup, anniversaries, DST, kids' school events.

**3A — Schema & data**

- `events` table (id, household_id, title, starts_at, rrule, source, kind,
  generates_task_after_days, …)
- `national_events` seed table (US federal holidays, tax deadlines, Election Day, DST, common
  observances) — read-only at the app level
- `household_event_subscriptions` per-household opt-in for the national feed
- RLS, indexes, migration

**3B — Custom event UI**

- `/events` route with calendar / list view of all custom + opted-in national events
- Create / edit / delete events (CRUD pattern from spaces management)
- Recurrence picker reused from tasks

**3C — National feed opt-in**

- `/settings/calendar` with category toggles (Holidays, Tax deadlines, DST, Election Day,
  Observances)
- National events render alongside custom events when subscribed

**3D — Notifications dispatcher**

- Supabase Edge Function on cron (daily morning + per-event triggers)
- Web Push subscription flow (PWA service worker)
- Resend digest email (weekly summary + day-of reminders)
- User notification preferences (per channel, per category)

**3E — Event → task generation**

- Per-event rule: "create a task N days before"
- Task carries forward to dashboard with the event's metadata

### Phase 4 — PWA polish

- Installable PWA (`manifest.ts`, service worker, icons)
- Offline cache for the latest pending task list
- Optimistic mutations across the board (full coverage, not just where it lives now)
- Push notification subscription UI
- Add-to-home-screen prompts on iOS / Android / desktop

### Phase 5 — Lists & assets

Two side surfaces that handle different patterns from tasks:

- **Lists** (groceries, packing, Costco run): rapid-add UX, no due dates, no assignment, just
  title + checkbox; reorder by drag; clear-checked button
- **Assets** (HVAC, water heater, car): durable household objects with recurring maintenance
  attached; an asset is a parent that produces tasks ("Replace HVAC filter every 3 months")

### Phase 6 — iOS App Store

- Capacitor scaffold over the same web code
- APNs push integration
- App icon / splash / metadata
- TestFlight build and submission

### Phase 7 — Stretch (post-1.0)

- Budgets / household finance items
- Document vault (warranties, manuals, receipts) via Supabase Storage
- Shared contacts (plumber, pediatrician, electrician)
- Kid-mode UI (simpler chrome for younger users)
- Multi-tenant SaaS opening (billing, marketing site)
- Native share-sheet integration (iOS) for "send to Cohabispace as a task"

## Architecture decisions (the load-bearing ones)

These are the calls that shape the rest of the codebase. Document them so we don't accidentally
undo them.

### Single `tasks` table for everything

Chores, projects with subtasks, one-offs all live in one table. A "project" is just a task with
`parent_task_id` children. A recurring task is one with `rrule` set; on complete, the action
spawns the next instance with the next due date pre-filled.

This keeps the surface area small. Every list view is "tasks where status = pending" with optional
filters. Every action operates on the same shape. Subtasks UI is a smaller list nested inside the
edit drawer.

### Service-role for writes, RLS for reads

All Server Actions write through the **service-role** Supabase client. The action code is the
authorization layer (always calls `requireUser` + role check). RLS still gates reads on pages.

Why: in the `@supabase/ssr` v0.7 + Next 16 cookie pipeline, the JWT sometimes fails to propagate
from server actions to PostgREST, producing spurious "row violates RLS" errors even when the user
is authenticated. Service-role + explicit role checks is robust and equally secure (we control the
code path). Page reads work fine with RLS and keep using it.

### Active household via cookie

The "currently viewing" household is stored in an `httpOnly` cookie set per user. Switching
households flips the cookie and revalidates `/`. Not URL-scoped (no `/h/[id]/...` prefix).
Tradeoff: can't have two tabs open in different households. Revisit when it bites.

### Cache Components on; Suspense around request-time data

`cacheComponents: true` is set in `next.config.ts`. Authenticated routes are dynamic by virtue of
reading cookies in `requireUser`. The root layout wraps `{children}` in `<Suspense>` so the static
shell prerenders even for dynamic child routes.

Routes that read `searchParams` (auth callbacks, sign-in `?next=`, dashboard `?tag=`,
`/spaces/[id]?tag=`) follow Next 16's async-API contract: `params: Promise<...>` and
`searchParams: Promise<...>`.

### `proxy.ts` (not `middleware.ts`)

Renamed in Next 16. Lives at `src/proxy.ts`, refreshes the Supabase session cookie on every
navigation, calls `getUser()` (not `getSession()`) so the JWT is revalidated against Supabase.

### Lazy per-property env validation

`src/lib/env/server.ts` exports a Proxy that validates each env var only when _that specific
property_ is read. Missing `RESEND_API_KEY` doesn't block Supabase-only flows (like household
creation). Each property errors helpfully with a "set it in `.env.local`" message.

### Spaces have a colored letter mark, no emojis

Visual identity for a space is a colored letter (first letter of name, in the space's color). No
emoji or icon picker. Picked deliberately to match the Linear / Things 3 aesthetic. Schema column
`icon` is nullable and unused — kept around for a future Lucide-icon picker if we ever want one.

### Inline `#tag` syntax

Tags are extracted from the title at save time. The clean title and tags array are stored
separately. Editing a task means editing the title, including hashtags — there's no separate tag
editor. Single source of truth.

### Hand-written Database types

`src/lib/supabase/database.types.ts` is hand-maintained until you run `npm run db:types` (which
requires the Supabase CLI linked to the project). The hand-written version covers everything we
need; the generated version drops in cleanly.

## Open product questions

Things to think about before / during Phase 3:

- **Push notifications: web push only or Capacitor first?** Web push works on iOS 16.4+ but has
  caveats; Capacitor + APNs is more reliable. Could ship web-push for desktop / Android in Phase 4
  and APNs in Phase 6.
- **Time zones.** Everything's currently in the server's local TZ (UTC in production). A per-user
  TZ preference matters once notifications fire — a "Tax Day" reminder shouldn't show at 7pm in
  someone's local time on April 14.
- **Event → task generation default.** Most events shouldn't auto-generate tasks (DST,
  anniversaries). Tax Day clearly should. Maybe a per-event toggle when creating + a sensible
  default per national feed item.
- **National feed granularity.** One global toggle vs. per-category? Per-category is probably
  right (federal holidays but not religious observances, say). Drives schema shape.
- **Calendar import.** Should we offer iCal / Google Calendar import for kids' school schedules,
  or punt that to copy-paste / manual creation?

## Backlog (deferred from Phase 1–2)

Small things we noticed and skipped. Pull from this list between bigger pieces.

- **Tag sidebar section.** `getTagsWithCounts` is built, just not surfaced. ~30 lines to wire in.
- **Tag pill global view.** Currently click adds `?tag=` to current path. Could also have
  `/tags/[name]` as a global cross-space view.
- **Custom RRULE builder.** Only 5 presets (daily / weekdays / weekly / biweekly / monthly).
  "Mon + Thu", "every 3 months on the 15th" need a custom UI.
- **Time-of-day on due dates.** Everything anchors to noon to dodge TZ issues. Time picker chip
  when timezone work is done.
- **Subtask editing.** Subtasks are checkbox + title + delete only. Rename = delete + re-add today.
  An inline-edit (or per-subtask drawer) is overdue.
- **Project view route.** Subtasks live inside the edit drawer. For projects with many children, a
  dedicated `/tasks/[id]` page would breathe better.
- **"Unassigned" people view.** People sidebar lists members. An "Unassigned" entry showing tasks
  with no assignee would round it out.
- **Bulk actions.** Select multiple tasks → assign / move to space / delete in batch.
- **Search.** No global search yet. A `⌘K` palette over tasks / spaces / people would feel modern.
- **Drag-to-reorder** within a section (Things 3-style). Schema has `position` ready.
- **Soft-delete / undo.** Deletes are immediate. A 5-second "Undo" toast on delete actions is a
  small polish that significantly reduces accidental loss.

## Migrations

Applied in order (oldest to newest):

| #   | File                                          | What it does                                                                              |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | `20260430000001_initial_schema.sql`           | Profiles, households, household_members, household_invitations + RLS + helpers            |
| 2   | `20260430000002_phase2_tasks.sql`             | Tasks table + RLS + indexes (recurrence, parent, tags columns ready from day one)         |
| 3   | `20260430000003_phase2g_spaces.sql`           | Spaces table + `tasks.space_id` + `is_household_adult` helper + auto-seed trigger         |
| 4   | `20260430000004_drop_space_emoji_icons.sql`   | Updated seed function to omit emojis; cleared `icon` on existing rows                     |

Apply with `npx supabase db push` (after `npx supabase link`). Or paste the SQL into the dashboard
editor. Re-run `npm run db:types` after applying to refresh the typed client.

## Where to look in the code

- `src/app/(app)/...` — authenticated routes (dashboard, spaces, people, completed, settings)
- `src/app/(auth)/...` — sign-in / sign-up / password reset / accept-invite
- `src/features/` — feature folders (vertical slices): auth, households, invitations, spaces, tasks
- `src/components/ui/` — shadcn primitives (only modify after considering whether to wrap)
- `src/components/` — shared components (app-shell, app-sidebar, theme-toggle, user-menu)
- `src/lib/dal.ts` — Data Access Layer (cached `getCurrentUser` + `requireUser`)
- `src/lib/supabase/{server,browser,service,middleware}.ts` — clients
- `src/lib/supabase/errors.ts` — `QueryError` wrapper for readable Postgrest failures
- `src/lib/env/{client,server}.ts` — lazy env validation
- `src/proxy.ts` — Next 16 middleware-equivalent (Supabase session refresh)
- `supabase/migrations/` — versioned SQL
- `node_modules/next/dist/docs/` — Next 16 docs (re-read when memory drifts; the framework
  explicitly warns it's not what AI training data has)
