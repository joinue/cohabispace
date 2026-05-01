import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/dal";
import {
  readActiveHouseholdId,
  writeActiveHouseholdId,
} from "@/features/households/active-household";
import type { Database, HouseholdRole } from "@/lib/supabase/database.types";

type HouseholdRow = Database["public"]["Tables"]["households"]["Row"];

export type HouseholdWithRole = HouseholdRow & { role: HouseholdRole };

const ROLE_ORDER: Record<HouseholdRole, number> = {
  owner: 0,
  admin: 1,
  adult: 2,
  teen: 3,
  child: 4,
  guest: 5,
};

/**
 * Households the current user is a member of, sorted by name.
 * Memoized per render via `cache()`.
 */
export const getMyHouseholds = cache(async (): Promise<HouseholdWithRole[]> => {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("household_members")
    .select("role, household:households(*)")
    .eq("user_id", user.id);

  if (error) throw error;
  if (!data) return [];

  return data
    .map((row) => {
      const h = row.household as unknown as HouseholdRow | null;
      if (!h) return null;
      return { ...h, role: row.role as HouseholdRole };
    })
    .filter((h): h is HouseholdWithRole => h !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
});

/**
 * Resolve the active household: read the cookie, validate the user is
 * still a member, otherwise fall back to the first household and persist
 * that as the new active.
 *
 * Returns `null` only if the user has zero households.
 */
export const getActiveHousehold = cache(async (): Promise<HouseholdWithRole | null> => {
  const households = await getMyHouseholds();
  if (households.length === 0) return null;

  const cookieId = await readActiveHouseholdId();
  const fromCookie = cookieId ? households.find((h) => h.id === cookieId) : undefined;
  if (fromCookie) return fromCookie;

  const fallback = households[0]!;
  await writeActiveHouseholdId(fallback.id);
  return fallback;
});

/**
 * Members of a specific household, sorted by role then join date.
 * RLS enforces that the caller must be a member to see any rows.
 */
export async function getHouseholdMembers(householdId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("household_members")
    .select("role, joined_at, user:profiles(id, display_name, email, avatar_url)")
    .eq("household_id", householdId);

  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const u = row.user as unknown as {
        id: string;
        display_name: string | null;
        email: string;
        avatar_url: string | null;
      } | null;
      if (!u) return null;
      return {
        userId: u.id,
        displayName: u.display_name,
        email: u.email,
        avatarUrl: u.avatar_url,
        role: row.role as HouseholdRole,
        joinedAt: row.joined_at as string,
      };
    })
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .sort((a, b) => {
      const r = ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
      return r !== 0 ? r : a.joinedAt.localeCompare(b.joinedAt);
    });
}

export type HouseholdMember = Awaited<ReturnType<typeof getHouseholdMembers>>[number];
