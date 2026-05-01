import type { NextRequest } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  /**
   * Match all paths except for:
   *   - Next.js internals (_next/*)
   *   - Static assets in /public served at the root (svg/png/jpg/jpeg/gif/webp/ico)
   * Auth callback routes are intentionally NOT excluded — they need session
   * refresh to flush new tokens after OAuth/magic-link redirects.
   */
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
