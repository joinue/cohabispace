import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { publicEnv } from "@/lib/env/client";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Reads/writes auth cookies via Next.js `cookies()`.
 *
 * Cookie writes from Server Components throw — the framework refuses them —
 * so the catch is intentional. The proxy at `src/proxy.ts` handles session
 * refresh on every navigation.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component context — cookies are read-only here.
            // The proxy refreshes on the next request.
          }
        },
      },
    },
  );
}
