import "server-only";

import { createClient } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Privileged Supabase client that bypasses Row-Level Security.
 *
 * Use ONLY for trusted server actions that must operate across users
 * (e.g. accepting an invitation by token, sending a transactional email
 * tied to a user the caller doesn't own). Never expose to the client.
 */
export function createSupabaseServiceClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
