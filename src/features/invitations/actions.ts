"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireUser } from "@/lib/dal";
import { type FormState, fieldErrorsFromZod } from "@/lib/forms";
import { INVITATION_EXPIRES_IN_DAYS, sendInvitationEmail } from "@/features/invitations/email";
import { generateInvitationToken, hashInvitationToken } from "@/features/invitations/tokens";
import { createInvitationSchema } from "@/features/invitations/schemas";
import { writeActiveHouseholdId } from "@/features/households/active-household";

async function requireHouseholdAdmin(userId: string, householdId: string) {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("household_members")
    .select("role")
    .eq("household_id", householdId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { ok: false as const, error: "You're not a member of that household." };
  if (data.role !== "owner" && data.role !== "admin") {
    return { ok: false as const, error: "Only household admins can do that." };
  }
  return { ok: true as const, role: data.role };
}

export async function createInvitationAction(
  householdId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = createInvitationSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFromZod(parsed.error.issues) };

  const adminCheck = await requireHouseholdAdmin(user.id, householdId);
  if (!adminCheck.ok) return { error: adminCheck.error };

  const service = createSupabaseServiceClient();

  const [householdRes, profileRes] = await Promise.all([
    service.from("households").select("name").eq("id", householdId).maybeSingle(),
    service.from("profiles").select("display_name, email").eq("id", user.id).maybeSingle(),
  ]);

  if (!householdRes.data) {
    return { error: "Couldn't find that household." };
  }

  const { token, tokenHash } = generateInvitationToken();
  const expiresAt = new Date(
    Date.now() + INVITATION_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error: insertError } = await service.from("household_invitations").insert({
    household_id: householdId,
    email: parsed.data.email,
    role: parsed.data.role,
    token_hash: tokenHash,
    invited_by: user.id,
    expires_at: expiresAt,
  });
  if (insertError) {
    return { error: insertError.message };
  }

  try {
    await sendInvitationEmail({
      to: parsed.data.email,
      inviterName: profileRes.data?.display_name ?? user.email ?? "A friend",
      householdName: householdRes.data.name,
      token,
    });
  } catch (err) {
    // Roll back so the user can retry without a stale pending row.
    await service.from("household_invitations").delete().eq("token_hash", tokenHash);
    return {
      error:
        err instanceof Error
          ? `Couldn't send the email: ${err.message}`
          : "Couldn't send the invitation email.",
    };
  }

  revalidatePath(`/households/${householdId}/members`);
  return {};
}

export async function revokeInvitationAction(invitationId: string, householdId: string) {
  const user = await requireUser();
  const adminCheck = await requireHouseholdAdmin(user.id, householdId);
  if (!adminCheck.ok) return;

  const service = createSupabaseServiceClient();
  await service
    .from("household_invitations")
    .delete()
    .eq("id", invitationId)
    .eq("household_id", householdId);

  revalidatePath(`/households/${householdId}/members`);
}

export type AcceptInvitationResult =
  | { ok: true; householdId: string; householdName: string }
  | {
      ok: false;
      reason: "not_found" | "expired" | "already_accepted" | "revoked" | "already_member";
    };

/**
 * Accept an invitation by its plaintext token. Used from
 * `/accept-invite/[token]`. The token is hashed and looked up; the invitation
 * is then marked accepted and a household_members row is inserted via the
 * service-role client.
 */
export async function acceptInvitationAction(token: string): Promise<AcceptInvitationResult> {
  const user = await requireUser();
  const tokenHash = hashInvitationToken(token);

  const service = createSupabaseServiceClient();

  const { data: invitation, error } = await service
    .from("household_invitations")
    .select("id, household_id, email, role, status, expires_at, household:households(name)")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !invitation) return { ok: false, reason: "not_found" };
  if (invitation.status === "revoked") return { ok: false, reason: "revoked" };
  if (invitation.status === "accepted") return { ok: false, reason: "already_accepted" };
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    await service
      .from("household_invitations")
      .update({ status: "expired" })
      .eq("id", invitation.id);
    return { ok: false, reason: "expired" };
  }

  const { data: existing } = await service
    .from("household_members")
    .select("user_id")
    .eq("household_id", invitation.household_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await service
      .from("household_invitations")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invitation.id);
    return { ok: false, reason: "already_member" };
  }

  const { error: insertError } = await service.from("household_members").insert({
    household_id: invitation.household_id,
    user_id: user.id,
    role: invitation.role,
  });
  if (insertError) return { ok: false, reason: "not_found" };

  await service
    .from("household_invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  await writeActiveHouseholdId(invitation.household_id);
  revalidatePath("/", "layout");

  const household = invitation.household as unknown as { name: string } | null;
  return {
    ok: true,
    householdId: invitation.household_id,
    householdName: household?.name ?? "your new household",
  };
}
