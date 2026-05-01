"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireUser } from "@/lib/dal";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import { writeActiveHouseholdId } from "@/features/households/active-household";
import { createHouseholdSchema } from "@/features/households/schemas";

/**
 * Self-heal a missing `profiles` row. The `handle_new_user` trigger normally
 * creates it on auth signup, but if the migration was applied AFTER an
 * account was already created (or the trigger ever failed), the FK from
 * `households.created_by → profiles.id` will reject the household insert.
 * Idempotent; uses the service role to bypass profiles' (intentionally
 * restrictive) policies.
 */
async function ensureProfileExists(user: {
  id: string;
  email?: string;
  user_metadata?: { display_name?: unknown };
}) {
  const service = createSupabaseServiceClient();
  const displayName =
    typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : (user.email?.split("@")[0] ?? null);

  await service.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      display_name: displayName,
    },
    { onConflict: "id", ignoreDuplicates: true },
  );
}

export async function createHouseholdAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = createHouseholdSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  await ensureProfileExists(user);

  // Server Actions write through the service role: the `@supabase/ssr` +
  // Next 16 cookie pipeline can intermittently fail to forward the JWT to
  // PostgREST in actions, leading to spurious RLS denials. Identity is
  // already verified via `requireUser`, and we always set `created_by` to
  // the verified user.id, so the auth invariant is preserved without
  // depending on PostgREST's JWT propagation. The `seed_household_owner`
  // AFTER trigger still seeds the creator as the household's owner.
  const service = createSupabaseServiceClient();
  const { data, error } = await service
    .from("households")
    .insert({ name: parsed.data.name, created_by: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error:
        error?.message ??
        "Could not create the household. Check that the migration has been applied.",
    };
  }

  await writeActiveHouseholdId(data.id);
  revalidatePath("/", "layout");
  redirect("/dashboard" as Route);
}

export async function setActiveHouseholdAction(householdId: string): Promise<{ error?: string }> {
  const user = await requireUser();

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("household_members")
    .select("household_id")
    .eq("household_id", householdId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { error: "You're not a member of that household." };

  await writeActiveHouseholdId(householdId);
  revalidatePath("/", "layout");
  return {};
}

export async function leaveHouseholdAction(householdId: string): Promise<void> {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  await service
    .from("household_members")
    .delete()
    .eq("household_id", householdId)
    .eq("user_id", user.id);

  await writeActiveHouseholdId(null);
  revalidatePath("/", "layout");
  redirect("/dashboard" as Route);
}
