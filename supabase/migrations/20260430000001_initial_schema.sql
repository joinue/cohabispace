-- ============================================================================
-- 20260430000001 — initial schema
--
-- Tables : profiles, households, household_members, household_invitations
-- Enums  : household_role, invitation_status
-- Helpers: is_household_member(uuid), is_household_admin(uuid), set_updated_at()
-- Hooks  : auth.users → profiles, households → seed creator as owner
--
-- All household-scoped tables are protected by Row-Level Security. The DAL
-- layer (`src/lib/dal.ts`) and Supabase Auth provide `auth.uid()`.
-- ============================================================================

-- Required extensions ---------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enums -----------------------------------------------------------------------
create type public.household_role as enum (
  'owner',
  'admin',
  'adult',
  'teen',
  'child',
  'guest'
);

create type public.invitation_status as enum (
  'pending',
  'accepted',
  'revoked',
  'expired'
);

-- Generic timestamp trigger ---------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Profiles (1-to-1 with auth.users) -------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        citext not null,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a Supabase auth user is created ------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Households ------------------------------------------------------------------
create table public.households (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger households_set_updated_at
  before update on public.households
  for each row execute function public.set_updated_at();

-- Household members (junction with role) --------------------------------------
create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  role         public.household_role not null default 'adult',
  joined_at    timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index household_members_user_id_idx on public.household_members (user_id);

-- Seed creator as owner whenever a household row is inserted ------------------
create or replace function public.seed_household_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.household_members (household_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_household_created
  after insert on public.households
  for each row execute function public.seed_household_owner();

-- Invitations -----------------------------------------------------------------
-- The plaintext token is sent in the invite email; we store only the SHA-256
-- hash so a DB compromise doesn't yield usable invite links.
create table public.household_invitations (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  email        citext not null,
  role         public.household_role not null default 'adult',
  token_hash   text not null unique,
  invited_by   uuid not null references public.profiles(id) on delete restrict,
  status       public.invitation_status not null default 'pending',
  expires_at   timestamptz not null,
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

create index household_invitations_household_id_idx
  on public.household_invitations (household_id);
create index household_invitations_email_idx
  on public.household_invitations (email);

-- RLS helpers (security definer so they bypass RLS while evaluating) ---------
create or replace function public.is_household_member(hid uuid)
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
  );
$$;

create or replace function public.is_household_admin(hid uuid)
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
      and role in ('owner', 'admin')
  );
$$;

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.household_invitations enable row level security;

-- profiles --------------------------------------------------------------------
create policy profiles_select_self
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- See profiles of users you share a household with.
create policy profiles_select_household_peers
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1
      from public.household_members me
      join public.household_members them on me.household_id = them.household_id
      where me.user_id = auth.uid()
        and them.user_id = profiles.id
    )
  );

create policy profiles_update_self
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- households ------------------------------------------------------------------
create policy households_select_member
  on public.households for select
  to authenticated
  using (public.is_household_member(id));

create policy households_insert_self
  on public.households for insert
  to authenticated
  with check (created_by = auth.uid());

create policy households_update_admin
  on public.households for update
  to authenticated
  using (public.is_household_admin(id))
  with check (public.is_household_admin(id));

-- Owner-only delete is enforced in application code; RLS just blocks non-admins.
create policy households_delete_admin
  on public.households for delete
  to authenticated
  using (public.is_household_admin(id));

-- household_members -----------------------------------------------------------
create policy household_members_select_household
  on public.household_members for select
  to authenticated
  using (public.is_household_member(household_id));

create policy household_members_update_admin
  on public.household_members for update
  to authenticated
  using (public.is_household_admin(household_id))
  with check (public.is_household_admin(household_id));

create policy household_members_delete
  on public.household_members for delete
  to authenticated
  using (
    public.is_household_admin(household_id)
    or user_id = auth.uid()
  );

-- No INSERT policy — members are added via:
--   1. Trigger when a household is created (creator → owner)
--   2. Service-role server action when an invitation is accepted

-- household_invitations -------------------------------------------------------
create policy household_invitations_select_admin
  on public.household_invitations for select
  to authenticated
  using (public.is_household_admin(household_id));

create policy household_invitations_insert_admin
  on public.household_invitations for insert
  to authenticated
  with check (
    public.is_household_admin(household_id)
    and invited_by = auth.uid()
  );

create policy household_invitations_update_admin
  on public.household_invitations for update
  to authenticated
  using (public.is_household_admin(household_id))
  with check (public.is_household_admin(household_id));

create policy household_invitations_delete_admin
  on public.household_invitations for delete
  to authenticated
  using (public.is_household_admin(household_id));
