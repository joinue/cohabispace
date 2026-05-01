import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnv } from "@/lib/env/client";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Refresh the Supabase session cookie on every request. Wired through
 * `src/proxy.ts` (Next 16's middleware-equivalent file convention).
 *
 * Notes:
 *   - This must read cookies from the incoming request and write them onto
 *     the outgoing response, so `getUser()` always sees the latest token.
 *   - Don't run heavy logic here — proxy runs on every navigation.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANT: getUser() — not getSession() — to revalidate the JWT against
  // Supabase. getSession() trusts the cookie blindly.
  await supabase.auth.getUser();

  return response;
}
