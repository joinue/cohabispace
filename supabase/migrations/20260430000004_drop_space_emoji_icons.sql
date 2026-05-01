-- ============================================================================
-- 20260430000004 — drop emoji icons from spaces
--
-- The UI has switched from emoji icons to colored letter marks (the first
-- letter of the space name in the space's color). The `icon` column stays
-- in the schema for future use (e.g. lucide icon picker), but:
--   - The seed function no longer assigns an emoji.
--   - Existing rows have their stored icon cleared so the UI renders
--     consistently for current households.
-- ============================================================================

create or replace function public.seed_default_spaces()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.spaces (household_id, name, color, position, created_by) values
    (new.id, 'Kitchen',     'amber',   100, new.created_by),
    (new.id, 'Living Room', 'blue',    200, new.created_by),
    (new.id, 'Bathroom',    'rose',    300, new.created_by),
    (new.id, 'Bedroom',     'violet',  400, new.created_by),
    (new.id, 'Outdoor',     'emerald', 500, new.created_by),
    (new.id, 'Errands',     'orange',  600, new.created_by);
  return new;
end;
$$;

update public.spaces set icon = null where icon is not null;
