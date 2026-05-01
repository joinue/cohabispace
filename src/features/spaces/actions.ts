"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireUser } from "@/lib/dal";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import type { Database, HouseholdRole } from "@/lib/supabase/database.types";
import { createSpaceSchema, updateSpaceSchema } from "@/features/spaces/schemas";

type SpaceInsert = Database["public"]["Tables"]["spaces"]["Insert"];
type SpaceUpdate = Database["public"]["Tables"]["spaces"]["Update"];

const ADULT_ROLES: HouseholdRole[] = ["owner", "admin", "adult"];

async function requireAdult(userId: string, householdId: string) {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("household_members")
    .select("role")
    .eq("household_id", householdId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { ok: false as const, error: "You're not a member of that household." };
  if (!ADULT_ROLES.includes(data.role)) {
    return {
      ok: false as const,
      error: "Only adults can manage spaces. Ask an admin if you need access.",
    };
  }
  return { ok: true as const, role: data.role };
}

export async function createSpaceAction(
  householdId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const adult = await requireAdult(user.id, householdId);
  if (!adult.ok) return { error: adult.error };

  const parsed = createSpaceSchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const service = createSupabaseServiceClient();

  // Place new space at the end (max(position) + 100 from existing active set).
  const { data: existing } = await service
    .from("spaces")
    .select("position")
    .eq("household_id", householdId)
    .is("archived_at", null)
    .order("position", { ascending: false, nullsFirst: false })
    .limit(1);

  const nextPos = (existing?.[0]?.position ?? 0) + 100;

  const insert: SpaceInsert = {
    household_id: householdId,
    name: parsed.data.name,
    color: parsed.data.color,
    position: nextPos,
    created_by: user.id,
  };

  const { error } = await service.from("spaces").insert(insert);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function updateSpaceAction(
  spaceId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: space } = await service
    .from("spaces")
    .select("household_id")
    .eq("id", spaceId)
    .maybeSingle();
  if (!space) return { error: "Space not found." };

  const adult = await requireAdult(user.id, space.household_id);
  if (!adult.ok) return { error: adult.error };

  const parsed = updateSpaceSchema.safeParse({
    name: formData.get("name") ?? undefined,
    color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const update: SpaceUpdate = {};
  if (parsed.data.name !== undefined) update.name = parsed.data.name;
  if (parsed.data.color !== undefined) update.color = parsed.data.color;

  if (Object.keys(update).length === 0) return {};

  const { error } = await service.from("spaces").update(update).eq("id", spaceId);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function archiveSpaceAction(spaceId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: space } = await service
    .from("spaces")
    .select("household_id")
    .eq("id", spaceId)
    .maybeSingle();
  if (!space) return;

  const adult = await requireAdult(user.id, space.household_id);
  if (!adult.ok) return;

  await service.from("spaces").update({ archived_at: new Date().toISOString() }).eq("id", spaceId);

  revalidatePath("/", "layout");
}

export async function unarchiveSpaceAction(spaceId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: space } = await service
    .from("spaces")
    .select("household_id")
    .eq("id", spaceId)
    .maybeSingle();
  if (!space) return;

  const adult = await requireAdult(user.id, space.household_id);
  if (!adult.ok) return;

  await service.from("spaces").update({ archived_at: null }).eq("id", spaceId);

  revalidatePath("/", "layout");
}

export async function deleteSpaceAction(spaceId: string) {
  const user = await requireUser();
  const service = createSupabaseServiceClient();

  const { data: space } = await service
    .from("spaces")
    .select("household_id")
    .eq("id", spaceId)
    .maybeSingle();
  if (!space) return;

  // Hard-delete is admin/owner only. RLS would block adults; we mirror it here.
  const { data: member } = await service
    .from("household_members")
    .select("role")
    .eq("household_id", space.household_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!member) return;
  if (member.role !== "owner" && member.role !== "admin") return;

  // Tasks' space_id will be set to NULL automatically (FK on delete set null).
  await service.from("spaces").delete().eq("id", spaceId);

  revalidatePath("/", "layout");
}
