import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { throwQueryError } from "@/lib/supabase/errors";
import { requireUser } from "@/lib/dal";
import type { Database } from "@/lib/supabase/database.types";

export type SpaceRow = Database["public"]["Tables"]["spaces"]["Row"];

/**
 * Active spaces for a household, ordered by `position` then `name`.
 * Excludes archived spaces. Memoized per render.
 */
export const getActiveSpaces = cache(async (householdId: string): Promise<SpaceRow[]> => {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("household_id", householdId)
    .is("archived_at", null)
    .order("position", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) throwQueryError(error, "Loading spaces");
  return data ?? [];
});

export const getArchivedSpaces = cache(async (householdId: string): Promise<SpaceRow[]> => {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("household_id", householdId)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) throwQueryError(error, "Loading archived spaces");
  return data ?? [];
});

export async function getSpace(spaceId: string): Promise<SpaceRow | null> {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.from("spaces").select("*").eq("id", spaceId).maybeSingle();
  return data ?? null;
}
