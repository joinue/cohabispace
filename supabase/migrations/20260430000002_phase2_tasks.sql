-- ============================================================================
-- 20260430000002 — Phase 2: tasks
--
-- Single unified `tasks` table modeling chores, projects, and one-offs.
--
-- Shape decisions:
--   - `parent_task_id` (self-FK) makes a "project" just a task with children.
--   - `series_id` groups recurring instances. One-offs get their own series
--     UUID; recurring tasks share series_id across regenerated instances.
--   - `rrule` is RFC 5545. The app generates the next instance when the
--     current one is marked complete (lazy regeneration — no precomputed
--     occurrence rows). Stored on the latest pending instance only.
--   - `tags` is `text[]` for v0. Migrate to a junction table later if we
--     need tag colors / metadata.
-- ============================================================================

create type public.task_status as enum ('pending', 'completed', 'skipped');

create table public.tasks (
  id              uuid primary key default gen_random_uuid(),
  household_id    uuid not null references public.households(id) on delete cascade,
  parent_task_id  uuid references public.tasks(id) on delete cascade,
  series_id       uuid not null default gen_random_uuid(),
  title           text not null check (char_length(title) between 1 and 200),
  notes           text,
  status          public.task_status not null default 'pending',
  due_at          timestamptz,
  completed_at    timestamptz,
  completed_by    uuid references public.profiles(id),
  assigned_to     uuid references public.profiles(id),
  created_by      uuid not null references public.profiles(id),
  rrule           text,
  tags            text[] not null default '{}',
  position        double precision,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index tasks_household_status_idx
  on public.tasks (household_id, status);
create index tasks_parent_task_id_idx
  on public.tasks (parent_task_id);
create index tasks_series_id_idx
  on public.tasks (series_id);
create index tasks_due_at_pending_idx
  on public.tasks (due_at)
  where status = 'pending';
create index tasks_assigned_to_pending_idx
  on public.tasks (assigned_to)
  where status = 'pending';

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.tasks enable row level security;

-- Read: any household member can see tasks within the household.
create policy tasks_select_member
  on public.tasks for select
  to authenticated
  using (public.is_household_member(household_id));

-- Insert: any household member can create tasks (created_by must be self).
create policy tasks_insert_member
  on public.tasks for insert
  to authenticated
  with check (
    public.is_household_member(household_id)
    and created_by = auth.uid()
  );

-- Update: any household member can update any task in the household.
-- (Granular rules — e.g. "only assignee or admin can complete" — live in
-- application code; the server actions enforce them.)
create policy tasks_update_member
  on public.tasks for update
  to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

-- Delete: admins or the task creator. Assignees can't delete tasks they
-- didn't create — they can only complete or skip.
create policy tasks_delete_creator_or_admin
  on public.tasks for delete
  to authenticated
  using (
    public.is_household_admin(household_id)
    or created_by = auth.uid()
  );
