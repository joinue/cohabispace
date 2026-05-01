-- ============================================================================
-- 20260430000003 — Phase 2G: spaces
--
-- A `space` is a household-level structural grouping for tasks — rooms
-- ("Kitchen"), themes ("Errands"), or persistent project containers
-- ("Bathroom remodel"). One task can belong to one space (or none —
-- "No space" is a valid state).
--
-- Roles:
--   - Adult+ (owner / admin / adult) can create and edit spaces.
--   - Only admin / owner can hard-delete; anyone can archive.
--   - Teen / child / guest can read but not modify.
-- ============================================================================

-- Helper: is the calling user adult+ in this household?
create or replace function public.is_household_adult(hid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = hid
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'adult')
  );
$$;

-- spaces ----------------------------------------------------------------------
create table public.spaces (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 60),
  icon         text,                 -- emoji or null
  color        text not null default 'slate',  -- token: slate, red, orange, amber, emerald, blue, violet, rose
  position     double precision,
  archived_at  timestamptz,
  created_by   uuid not null references public.profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index spaces_household_active_idx
  on public.spaces (household_id, position)
  where archived_at is null;

create trigger spaces_set_updated_at
  before update on public.spaces
  for each row execute function public.set_updated_at();

-- tasks.space_id --------------------------------------------------------------
alter table public.tasks
  add column space_id uuid references public.spaces(id) on delete set null;

create index tasks_space_id_pending_idx
  on public.tasks (space_id)
  where status = 'pending';

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.spaces enable row level security;

create policy spaces_select_member
  on public.spaces for select
  to authenticated
  using (public.is_household_member(household_id));

create policy spaces_insert_adult
  on public.spaces for insert
  to authenticated
  with check (
    public.is_household_adult(household_id)
    and created_by = auth.uid()
  );

create policy spaces_update_adult
  on public.spaces for update
  to authenticated
  using (public.is_household_adult(household_id))
  with check (public.is_household_adult(household_id));

create policy spaces_delete_admin
  on public.spaces for delete
  to authenticated
  using (public.is_household_admin(household_id));

-- Seed default spaces on household creation ----------------------------------
create or replace function public.seed_default_spaces()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.spaces (household_id, name, icon, color, position, created_by) values
    (new.id, 'Kitchen',     '🍳', 'amber',   100, new.created_by),
    (new.id, 'Living Room', '🛋️', 'blue',    200, new.created_by),
    (new.id, 'Bathroom',    '🚿', 'rose',    300, new.created_by),
    (new.id, 'Bedroom',     '🛏️', 'violet',  400, new.created_by),
    (new.id, 'Outdoor',     '🌳', 'emerald', 500, new.created_by),
    (new.id, 'Errands',     '🧺', 'orange',  600, new.created_by);
  return new;
end;
$$;

create trigger on_household_seed_spaces
  after insert on public.households
  for each row execute function public.seed_default_spaces();
