import "server-only";

import { cache } from "react";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Per-render memoized current-user lookup. Safe to call from any Server
 * Component, layout, or Server Action — the underlying network call to
 * Supabase happens at most once per render.
 *
 * Returns the verified Supabase user (NOT the raw session) or `null` when
 * unauthenticated. We use `getUser()` rather than `getSession()` so the
 * JWT is revalidated against Supabase, which is the recommendation for
 * any code that gates access on the user's identity.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
});

/**
 * Server-side guard for authenticated routes. Redirects to the sign-in
 * page (preserving the original path) when the user is not signed in.
 *
 * **Always re-call this inside Server Actions** even if a parent layout
 * already redirected — Server Actions are independent entry points.
 */
export async function requireUser(redirectTo?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const target = (
      redirectTo ? `/sign-in?next=${encodeURIComponent(redirectTo)}` : "/sign-in"
    ) as Route;
    redirect(target);
  }
  return user;
}
