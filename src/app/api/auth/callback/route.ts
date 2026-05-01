import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase Auth callback. Used for:
 *   - Email confirmation after sign-up (`?code=…`)
 *   - Password reset link click (`?code=…&next=/reset-password`)
 *   - OAuth providers (future)
 *
 * Exchanges the one-time code for a session, then redirects to `next`
 * (or `/dashboard` if absent). On failure, sends the user back to sign-in
 * with an error flag so we can surface a toast.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_code", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_failed", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
