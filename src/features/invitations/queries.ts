import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { HouseholdRole, InvitationStatus } from "@/lib/supabase/database.types";

export interface PendingInvitation {
  id: string;
  email: string;
  role: HouseholdRole;
  expiresAt: string;
  createdAt: string;
  status: InvitationStatus;
}

export async function getPendingInvitations(householdId: string): Promise<PendingInvitation[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("household_invitations")
    .select("id, email, role, expires_at, created_at, status")
    .eq("household_id", householdId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    status: row.status,
  }));
}
